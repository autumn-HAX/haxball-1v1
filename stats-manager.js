const fs = require('fs');
const path = require('path');

class StatsManager {
    constructor() {
        this.statsFile = path.join(__dirname, 'player_stats.json');
        this.stats = this.loadStats();
        this.currentTournamentStats = new Map();
    }

    loadStats() {
        try {
            if (fs.existsSync(this.statsFile)) {
                const data = fs.readFileSync(this.statsFile, 'utf8');
                return JSON.parse(data);
            }
            return {};
        } catch (error) {
            console.error('Error loading stats:', error);
            return {};
        }
    }

    saveStats() {
        try {
            fs.writeFileSync(this.statsFile, JSON.stringify(this.stats, null, 2));
        } catch (error) {
            console.error('Error saving stats:', error);
        }
    }

    initPlayerStats(auth) {
        if (!this.stats[auth]) {
            this.stats[auth] = {
                torneosJugados: 0,
                torneosGanados: 0,
                partidosTorneoJugados: 0,
                partidosTorneoGanados: 0,
                gruposJugados: 0,
                gruposPrimero: 0,
                gruposSegundo: 0,
                semifinalesJugadas: 0,
                semifinalesGanadas: 0,
                finalesJugadas: 0,
                finalesGanadas: 0,
                golesEnTorneos: 0,
                golesRecibidosEnTorneos: 0,
                mejorPosicion: "N/A",
                ultimoTorneo: null
            };
            this.saveStats();
        }
        return this.stats[auth];
    }

    initCurrentTournamentStats(auth) {
        if (!this.currentTournamentStats.has(auth)) {
            this.currentTournamentStats.set(auth, {
                partidosJugados: 0,
                partidosGanados: 0,
                golesMarcados: 0,
                golesRecibidos: 0,
                fase: 'grupos'
            });
        }
        return this.currentTournamentStats.get(auth);
    }

    getPlayerStats(auth) {
        return this.stats[auth] || this.initPlayerStats(auth);
    }

    updateMatchStats(auth, data) {
        if (!auth) return;

        const stats = this.getPlayerStats(auth);
        const currentStats = this.initCurrentTournamentStats(auth);
        
        currentStats.partidosJugados++;
        currentStats.golesMarcados += data.golesMarcados;
        currentStats.golesRecibidos += data.golesRecibidos;
        if (data.victoria) currentStats.partidosGanados++;
        currentStats.fase = data.fase;

        stats.partidosTorneoJugados++;
        stats.golesEnTorneos += data.golesMarcados;
        stats.golesRecibidosEnTorneos += data.golesRecibidos;
        if (data.victoria) stats.partidosTorneoGanados++;

        this.saveStats();
    }

    updateTournamentStats(auth, data) {
        const stats = this.getPlayerStats(auth);
        const currentStats = this.currentTournamentStats.get(auth) || {
            partidosJugados: 0,
            partidosGanados: 0,
            golesMarcados: 0,
            golesRecibidos: 0
        };
        
        stats.torneosJugados++;
        
        stats.gruposJugados++;
        if (data.posicionGrupo === 1) stats.gruposPrimero++;
        if (data.posicionGrupo === 2) stats.gruposSegundo++;

        if (data.llegoSemis) {
            stats.semifinalesJugadas++;
            if (data.ganoSemis) stats.semifinalesGanadas++;
        }
        
        if (data.llegoFinal) {
            stats.finalesJugadas++;
            if (data.ganoFinal) {
                stats.finalesGanadas++;
                stats.torneosGanados++;
            }
        }

        const posicionActual = data.posicionFinal;
        if (stats.mejorPosicion === "N/A" || posicionActual < parseInt(stats.mejorPosicion)) {
            stats.mejorPosicion = posicionActual.toString();
        }

        stats.ultimoTorneo = Date.now();
        
        this.saveStats();
        this.currentTournamentStats.delete(auth);
    }

    formatStats(auth, name) {
        const stats = this.getPlayerStats(auth);
        const currentStats = this.currentTournamentStats.get(auth);
        
        const winRateTorneos = stats.torneosJugados > 0 
            ? ((stats.torneosGanados / stats.torneosJugados) * 100).toFixed(1) 
            : 0;
            
        const winRateFinal = stats.finalesJugadas > 0
            ? ((stats.finalesGanadas / stats.finalesJugadas) * 100).toFixed(1)
            : 0;

        const winRatePartidos = stats.partidosTorneoJugados > 0
            ? ((stats.partidosTorneoGanados / stats.partidosTorneoJugados) * 100).toFixed(1)
            : 0;

        const ultimoTorneo = stats.ultimoTorneo 
            ? new Date(stats.ultimoTorneo).toLocaleDateString()
            : "Nunca";

        let statsLines = [
            `📊 Estadísticas de ${name}`,
            "──────────────────",
            `🏆 Torneos: ${stats.torneosGanados}/${stats.torneosJugados} (${winRateTorneos}%)`,
            `⚽ Partidos: ${stats.partidosTorneoGanados}/${stats.partidosTorneoJugados} (${winRatePartidos}%)`,
            `🥅 Goles: ${stats.golesEnTorneos} marcados / ${stats.golesRecibidosEnTorneos} recibidos`,
            `🥇 Mejor posición: ${stats.mejorPosicion}`,
            "──────────────────",
            "📈 Fase de Grupos:",
            `• 1° Lugar: ${stats.gruposPrimero}/${stats.gruposJugados}`,
            `• 2° Lugar: ${stats.gruposSegundo}/${stats.gruposJugados}`,
            "──────────────────",
            "🎯 Eliminatorias:",
            `• Semifinales: ${stats.semifinalesGanadas}/${stats.semifinalesJugadas}`,
            `• Finales: ${stats.finalesGanadas}/${stats.finalesJugadas} (${winRateFinal}%)`,
            "──────────────────",
            `📅 Último torneo: ${ultimoTorneo}`
        ];

        if (currentStats) {
            const currentWinRate = currentStats.partidosJugados > 0
                ? ((currentStats.partidosGanados / currentStats.partidosJugados) * 100).toFixed(1)
                : 0;

            statsLines.push(
                "──────────────────",
                "🎮 Torneo Actual:",
                `• Partidos: ${currentStats.partidosGanados}/${currentStats.partidosJugados} (${currentWinRate}%)`,
                `• Goles: ${currentStats.golesMarcados} marcados / ${currentStats.golesRecibidos} recibidos`,
                `• Fase: ${currentStats.fase}`
            );
        }

        return statsLines;
    }

    getRanking() {
        return Object.entries(this.stats)
            .map(([auth, stats]) => ({
                auth,
                torneosGanados: stats.torneosGanados,
                finalesGanadas: stats.finalesGanadas,
                semifinalesGanadas: stats.semifinalesGanadas,
                gruposPrimero: stats.gruposPrimero,
                torneosJugados: stats.torneosJugados,
                partidosGanados: stats.partidosTorneoGanados,
                partidosJugados: stats.partidosTorneoJugados,
                winRate: stats.torneosJugados > 0 
                    ? ((stats.torneosGanados / stats.torneosJugados) * 100).toFixed(1)
                    : 0
            }))
            .sort((a, b) => {
                if (b.torneosGanados !== a.torneosGanados) return b.torneosGanados - a.torneosGanados;
                if (b.finalesGanadas !== a.finalesGanadas) return b.finalesGanadas - a.finalesGanadas;
                if (b.semifinalesGanadas !== a.semifinalesGanadas) return b.semifinalesGanadas - a.semifinalesGanadas;
                return b.gruposPrimero - a.gruposPrimero;
            })
            .slice(0, 10);
    }

    startNewTournament() {
        this.currentTournamentStats.clear();
    }
}

module.exports = StatsManager;
