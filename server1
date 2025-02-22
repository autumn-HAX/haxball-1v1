const HaxballJS = require("haxball.js");
const fs = require('fs');

console.log("Iniciando servidor...");

HaxballJS.then((HBInit) => {
    // Configuración de la sala
    const room = HBInit({
        roomName: "[TEST] Torneos Futsal 1vs1",
        maxPlayers: 12,
        public: false,
        noPlayer: true,
        token: "thr1.AAAAAGe57KAAOiCKR56KsQ.tIJA530zqlA", // Recuerda cambiar el token
        geo: null,
    });

    // Variables globales
    const adminIds = new Set();
    const ADMIN_PASSWORD = "1234";
    const teams = { RED: 1, BLUE: 2, SPECTATOR: 0 };
    let isTournamentMode = false;
    const PLAYERS_NEEDED_FOR_TOURNAMENT = 8;
    let tournamentCountdown = null;
	const waitingList = []; // Cola de espera de jugadores
	const TOURNAMENT_SIZE = 8; // Número de jugadores necesarios para el torneo
	const playerTeams = new Map(); // Para trackear el equipo de cada jugador
	const vacantPositions = new Set(); // Guardará los IDs de los jugadores que se fueron
	let lastPlayerTouch = null;
	let matchStartTimeout = null;
	const StatsManager = require('./stats-manager');
	const statsManager = new StatsManager();
	
	// Arrays de mensajes para goles
const goalMessages = [
    "🚀 ¡GOLAZO de {player} al minuto {time}!",
    "⚡ {player} la mandó a guardar al {time}. ¡Increíble definición!",
    "🎯 ¡QUÉ BARBARIDAD! {player} acaba de hacer un gol maravilloso al {time}",
    "🔥 ¡BOOM! {player} sacudió las redes al {time}",
    "✨ ¡BRILLANTE! {player} demuestra su calidad con ese gol al {time}",
    "💫 ¡Mamita querida! ¡{player} acaba de hacer magia al {time}!",
    "🌟 ¡A casa! {player} la mandó a guardar al {time}",
    "🎪 ¡Show de goles! {player} se suma a la fiesta al {time}"
];

const ownGoalMessages = [
    "🤦 Ups... {player} acaba de marcar en su propia portería al {time}",
    "😅 {player} se confundió de arco al {time}. ¡Estas cosas pasan!",
    "🫣 ¡{player} le quería regalar un gol al rival al {time}!",
    "😳 Houston, tenemos un problema... {player} marcó en contra al {time}",
    "🎭 Plot twist: {player} pensó que era el arco contrario al {time}",
    "🎪 {player} quería ser el payaso del circo al {time}",
    "🤪 ¡{player} estaba practicando para el equipo contrario al {time}!"
];
	
	// Variables para el sistema Anti-AFK (agregar con las otras variables globales)
const playerActivity = new Map(); // Almacena la última actividad de cada jugador
const AFK_TIMEOUT = 20 * 1000; // 20 segundos de inactividad máxima
const AFK_WARNING_TIME = 15 * 1000; // Aviso a los 15 segundos
let lastPlayerPositions = new Map(); // Almacena la última posición conocida de cada jugador
let isGamePaused = false; // Para controlar el estado de pausa
	
	
	 // Estadio Futsal x3 (usando el mismo JSON que funcionaba antes)
    var stadiumFileText = `{"name":"Futsal x3  by Bazinga from HaxMaps","width":620,"height":270,"spawnDistance":350,"bg":{"type":"hockey","width":550,"height":240,"kickOffRadius":80,"cornerRadius":0},"vertexes":[{"x":550,"y":240,"trait":"ballArea"},{"x":550,"y":-240,"trait":"ballArea"},{"x":0,"y":270,"trait":"kickOffBarrier"},{"x":0,"y":80,"bCoef":0.15,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":180},{"x":0,"y":-80,"bCoef":0.15,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":180},{"x":0,"y":-270,"trait":"kickOffBarrier"},{"x":-550,"y":-80,"cMask":["red","blue","ball"],"trait":"goalNet","curve":0,"color":"F8F8F8","pos":[-700,-80]},{"x":-590,"y":-80,"cMask":["red","blue","ball"],"trait":"goalNet","curve":0,"color":"F8F8F8","pos":[-700,-80]},{"x":-590,"y":80,"cMask":["red","blue","ball"],"trait":"goalNet","curve":0,"color":"F8F8F8","pos":[-700,80]},{"x":-550,"y":80,"cMask":["red","blue","ball"],"trait":"goalNet","curve":0,"color":"F8F8F8","pos":[-700,80]},{"x":550,"y":-80,"cMask":["red","blue","ball"],"trait":"goalNet","curve":0,"color":"F8F8F8","pos":[700,-80]},{"x":590,"y":-80,"cMask":["red","blue","ball"],"trait":"goalNet","curve":0,"color":"F8F8F8","pos":[700,-80]},{"x":590,"y":80,"cMask":["red","blue","ball"],"trait":"goalNet","curve":0,"color":"F8F8F8","pos":[700,80]},{"x":550,"y":80,"cMask":["red","blue","ball"],"trait":"goalNet","curve":0,"color":"F8F8F8","pos":[700,80]},{"x":-550,"y":80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8","pos":[-700,80]},{"x":-550,"y":240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8"},{"x":-550,"y":-80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8","pos":[-700,-80]},{"x":-550,"y":-240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8"},{"x":-550,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":550,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"x":550,"y":80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","pos":[700,80]},{"x":550,"y":240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea"},{"x":550,"y":-240,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8"},{"x":550,"y":-80,"bCoef":1.15,"cMask":["ball"],"trait":"ballArea","color":"F8F8F8","pos":[700,-80]},{"x":550,"y":-240,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":550,"y":-240,"bCoef":0,"cMask":["ball"],"trait":"ballArea"},{"x":-550,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0},{"x":550,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0},{"x":0,"y":-240,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":-80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":240,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"x":0,"y":-80,"bCoef":0.1,"cMask":["red","blue"],"trait":"kickOffBarrier","vis":true,"color":"F8F8F8"},{"x":0,"y":80,"bCoef":0.1,"cMask":["red","blue"],"trait":"kickOffBarrier","vis":true,"color":"F8F8F8"},{"x":0,"y":80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":-180},{"x":0,"y":-80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":-180},{"x":0,"y":80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":0},{"x":0,"y":-80,"trait":"kickOffBarrier","color":"F8F8F8","vis":true,"curve":0},{"x":-557.5,"y":80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"pos":[-700,80]},{"x":-557.5,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false},{"x":-557.5,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0},{"x":-557.5,"y":-80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"pos":[-700,-80]},{"x":557.5,"y":-240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0},{"x":557.5,"y":-80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","vis":false,"curve":0,"pos":[700,-80]},{"x":557.5,"y":80,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false,"pos":[700,80]},{"x":557.5,"y":240,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"vis":false},{"x":0,"y":-80,"bCoef":0.1,"trait":"line"},{"x":0,"y":80,"bCoef":0.1,"trait":"line"},{"x":-550,"y":-80,"bCoef":0.1,"trait":"line"},{"x":-550,"y":80,"bCoef":0.1,"trait":"line"},{"x":550,"y":-80,"bCoef":0.1,"trait":"line"},{"x":550,"y":80,"bCoef":0.1,"trait":"line"},{"x":-240,"y":256,"bCoef":0.1,"trait":"line"},{"x":-120,"y":256,"bCoef":0.1,"trait":"line"},{"x":-240,"y":-256,"bCoef":0.1,"trait":"line"},{"x":-120,"y":-224,"bCoef":0.1,"trait":"line"},{"x":-120,"y":-256,"bCoef":0.1,"trait":"line"},{"x":240,"y":256,"bCoef":0.1,"trait":"line"},{"x":120,"y":224,"bCoef":0.1,"trait":"line"},{"x":120,"y":256,"bCoef":0.1,"trait":"line"},{"x":240,"y":-224,"bCoef":0.1,"trait":"line"},{"x":240,"y":-256,"bCoef":0.1,"trait":"line"},{"x":120,"y":-224,"bCoef":0.1,"trait":"line"},{"x":120,"y":-256,"bCoef":0.1,"trait":"line"},{"x":-381,"y":240,"bCoef":0.1,"trait":"line"},{"x":-381,"y":256,"bCoef":0.1,"trait":"line"},{"x":-550,"y":200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":-90},{"x":-390,"y":70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":-550,"y":226,"bCoef":0.1,"trait":"line","curve":-90},{"x":-536,"y":240,"bCoef":0.1,"trait":"line","curve":-90},{"x":-550,"y":-200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":90},{"x":-390,"y":-70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":-550,"y":-226,"bCoef":0.1,"trait":"line","curve":90},{"x":-536,"y":-240,"bCoef":0.1,"trait":"line","curve":90},{"x":-556,"y":123,"bCoef":0.1,"trait":"line"},{"x":-575,"y":123,"bCoef":0.1,"trait":"line"},{"x":556,"y":123,"bCoef":0.1,"trait":"line"},{"x":575,"y":123,"bCoef":0.1,"trait":"line"},{"x":-556,"y":-123,"bCoef":0.1,"trait":"line"},{"x":-575,"y":-123,"bCoef":0.1,"trait":"line"},{"x":556,"y":-123,"bCoef":0.1,"trait":"line"},{"x":575,"y":-123,"bCoef":0.1,"trait":"line"},{"x":-381,"y":-240,"bCoef":0.1,"trait":"line"},{"x":-381,"y":-256,"bCoef":0.1,"trait":"line"},{"x":381,"y":240,"bCoef":0.1,"trait":"line"},{"x":381,"y":256,"bCoef":0.1,"trait":"line"},{"x":381,"y":-240,"bCoef":0.1,"trait":"line"},{"x":381,"y":-256,"bCoef":0.1,"trait":"line"},{"x":550,"y":-226,"bCoef":0.1,"trait":"line","curve":-90},{"x":536,"y":-240,"bCoef":0.1,"trait":"line","curve":-90},{"x":550,"y":226,"bCoef":0.1,"trait":"line","curve":90},{"x":536,"y":240,"bCoef":0.1,"trait":"line","curve":90},{"x":550,"y":200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":90},{"x":390,"y":70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":90},{"x":550,"y":-200,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":-90},{"x":390,"y":-70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":-90},{"x":390,"y":70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":390,"y":-70,"bCoef":0.1,"trait":"line","color":"F8F8F8","curve":0},{"x":-375,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":-375,"y":3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":375,"y":3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":-277.5,"y":3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":1,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-1,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":3,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-3,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-2,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":2,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":-3.5,"bCoef":0.1,"trait":"line","curve":180},{"x":277.5,"y":3.5,"bCoef":0.1,"trait":"line","curve":180}],"segments":[{"v0":6,"v1":7,"curve":0,"color":"F8F8F8","cMask":["red","blue","ball"],"trait":"goalNet","pos":[-700,-80],"y":-80},{"v0":7,"v1":8,"color":"F8F8F8","cMask":["red","blue","ball"],"trait":"goalNet","x":-590},{"v0":8,"v1":9,"curve":0,"color":"F8F8F8","cMask":["red","blue","ball"],"trait":"goalNet","pos":[-700,80],"y":80},{"v0":10,"v1":11,"curve":0,"color":"F8F8F8","cMask":["red","blue","ball"],"trait":"goalNet","pos":[700,-80],"y":-80},{"v0":11,"v1":12,"color":"F8F8F8","cMask":["red","blue","ball"],"trait":"goalNet","x":590},{"v0":12,"v1":13,"curve":0,"color":"F8F8F8","cMask":["red","blue","ball"],"trait":"goalNet","pos":[700,80],"y":80},{"v0":2,"v1":3,"trait":"kickOffBarrier"},{"v0":3,"v1":4,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.15,"cGroup":["blueKO"],"trait":"kickOffBarrier"},{"v0":3,"v1":4,"curve":-180,"vis":true,"color":"F8F8F8","bCoef":0.15,"cGroup":["redKO"],"trait":"kickOffBarrier"},{"v0":4,"v1":5,"trait":"kickOffBarrier"},{"v0":14,"v1":15,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":-550},{"v0":16,"v1":17,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":-550},{"v0":18,"v1":19,"vis":true,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","y":240},{"v0":20,"v1":21,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":550},{"v0":22,"v1":23,"vis":true,"color":"F8F8F8","bCoef":1.15,"cMask":["ball"],"trait":"ballArea","x":550},{"v0":24,"v1":25,"vis":true,"color":"F8F8F8","bCoef":0,"cMask":["ball"],"trait":"ballArea","x":550,"y":-240},{"v0":26,"v1":27,"curve":0,"vis":true,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","y":-240},{"v0":28,"v1":29,"vis":true,"color":"F8F8F8","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"v0":30,"v1":31,"vis":true,"color":"F8F8F8","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"trait":"kickOffBarrier"},{"v0":38,"v1":39,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-557.5},{"v0":40,"v1":41,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-557.5},{"v0":42,"v1":43,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":557.5},{"v0":44,"v1":45,"curve":0,"vis":false,"color":"F8F8F8","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":557.5},{"v0":46,"v1":47,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":0},{"v0":48,"v1":49,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-550},{"v0":50,"v1":51,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":550},{"v0":64,"v1":65,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-381},{"v0":66,"v1":67,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":69,"v1":68,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":70,"v1":71,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":67,"v1":71,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":73,"v1":72,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":74,"v1":75,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":123},{"v0":76,"v1":77,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":123},{"v0":78,"v1":79,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":-123},{"v0":80,"v1":81,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-240,"y":-123},{"v0":82,"v1":83,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-381},{"v0":84,"v1":85,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":381},{"v0":86,"v1":87,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":381},{"v0":89,"v1":88,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":91,"v1":90,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":92,"v1":93,"curve":90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":94,"v1":95,"curve":-90,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line"},{"v0":96,"v1":97,"curve":0,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":390},{"v0":99,"v1":98,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":98,"v1":99,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":101,"v1":100,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":100,"v1":101,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":103,"v1":102,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":102,"v1":103,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":105,"v1":104,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":104,"v1":105,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-375},{"v0":107,"v1":106,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":106,"v1":107,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":109,"v1":108,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":108,"v1":109,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":111,"v1":110,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":110,"v1":111,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":113,"v1":112,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":112,"v1":113,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":375},{"v0":115,"v1":114,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":114,"v1":115,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":117,"v1":116,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":116,"v1":117,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":119,"v1":118,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":118,"v1":119,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":121,"v1":120,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":120,"v1":121,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":-277.5},{"v0":123,"v1":122,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":122,"v1":123,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":125,"v1":124,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":124,"v1":125,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":127,"v1":126,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":126,"v1":127,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":129,"v1":128,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5},{"v0":128,"v1":129,"curve":180,"vis":true,"color":"F8F8F8","bCoef":0.1,"trait":"line","x":277.5}],"goals":[{"p0":[-557.5,-80],"p1":[-557.5,80],"team":"red"},{"p0":[557.5,80],"p1":[557.5,-80],"team":"blue"}],"discs":[{"radius":5,"pos":[-550,80],"color":"FF6666","trait":"goalPost","y":80},{"radius":5,"pos":[-550,-80],"color":"FF6666","trait":"goalPost","y":-80,"x":-560},{"radius":5,"pos":[550,80],"color":"6666FF","trait":"goalPost","y":80},{"radius":5,"pos":[550,-80],"color":"6666FF","trait":"goalPost","y":-80},{"radius":3,"invMass":0,"pos":[-550,240],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[-550,-240],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[550,-240],"color":"FFCC00","bCoef":0.1,"trait":"line"},{"radius":3,"invMass":0,"pos":[550,240],"color":"FFCC00","bCoef":0.1,"trait":"line"}],"planes":[{"normal":[0,1],"dist":-240,"bCoef":1,"trait":"ballArea","vis":false,"curve":0},{"normal":[0,-1],"dist":-240,"bCoef":1,"trait":"ballArea"},{"normal":[0,1],"dist":-270,"bCoef":0.1},{"normal":[0,-1],"dist":-270,"bCoef":0.1},{"normal":[1,0],"dist":-620,"bCoef":0.1},{"normal":[-1,0],"dist":-620,"bCoef":0.1},{"normal":[1,0],"dist":-620,"bCoef":0.1,"trait":"ballArea","vis":false,"curve":0},{"normal":[-1,0],"dist":-620,"bCoef":0.1,"trait":"ballArea","vis":false,"curve":0}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"line":{"vis":true,"bCoef":0.1,"cMask":[""]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}},"playerPhysics":{"bCoef":0,"acceleration":0.11,"kickingAcceleration":0.083,"kickStrength":5},"ballPhysics":{"radius":6.25,"bCoef":0.4,"invMass":1.5,"damping":0.99,"color":"FFCC00"}}`;
    room.setCustomStadium(stadiumFileText);
	
	 let hasAnnouncedOvertime = false; // Agregar esta variable con las otras variables globales

    // Variables del torneo
    let groupA = [];
    let groupB = [];
    let matchSchedule = [];
    let currentMatch = 0;
	let lastScores = null; // Agregar esta variable con las otras variables globales
	let semifinal1Winner = null;
	let semifinal2Winner = null;
	let isProcessingResult = false;
	let isGameEnding = false;  // Nueva variable global
	let waitingForReplacement = false;
	let replacementTimeout = null;
	let abandonedMatch = null;
	let abandonedTeam = null;
	let currentScores = null;
	let isStartingMatch = false;

	
	
	// Funciones de utilidad
    const isAdmin = (player) => {
        return player && (adminIds.has(player.id) || player.admin);
    };

    function getTeamSize(teamId) {
        let players = room.getPlayerList();
        return players.filter(p => p.team === teamId).length;
    }

    function assignPlayerTeam() {
        let redSize = getTeamSize(teams.RED);
        let blueSize = getTeamSize(teams.BLUE);

        if (redSize <= blueSize) {
            return teams.RED;
        } else {
            return teams.BLUE;
        }
    }
	function balanceTeams() {
        if (isTournamentMode) return; // No balancear en modo torneo

        let redPlayers = room.getPlayerList().filter(p => p.team === teams.RED);
        let bluePlayers = room.getPlayerList().filter(p => p.team === teams.BLUE);
        let redSize = redPlayers.length;
        let blueSize = bluePlayers.length;

        // Si la diferencia es mayor a 1, balancear
        if (Math.abs(redSize - blueSize) > 1) {
            if (redSize > blueSize) {
                // Mover último jugador de rojo a azul
                let playerToMove = redPlayers[redPlayers.length - 1];
                room.setPlayerTeam(playerToMove.id, teams.BLUE);
                room.sendAnnouncement(
                    `⚖️ ${playerToMove.name} ha sido movido al equipo 🔵 Azul para balancear los equipos`,
                    null,
                    0x00FF00
                );
            } else {
                // Mover último jugador de azul a rojo
                let playerToMove = bluePlayers[bluePlayers.length - 1];
                room.setPlayerTeam(playerToMove.id, teams.RED);
                room.sendAnnouncement(
                    `⚖️ ${playerToMove.name} ha sido movido al equipo 🔴 Rojo para balancear los equipos`,
                    null,
                    0x00FF00
                );
            }
        }
    }
	function checkTournamentStart() {
    let playerCount = room.getPlayerList().length;
    
    if (playerCount >= PLAYERS_NEEDED_FOR_TOURNAMENT && !isTournamentMode && !tournamentCountdown) {
        // Iniciar countdown
        room.sendAnnouncement("🎉 ¡8 jugadores alcanzados! El torneo comenzará en 10 segundos...", null, 0xFFFF00, "bold");
        
        let countdownSeconds = 10;
        tournamentCountdown = setInterval(() => {
            if (countdownSeconds > 0) {
                room.sendAnnouncement(`⏳ Torneo comienza en ${countdownSeconds} segundos...`, null, 0xFFFF00);
                countdownSeconds--;
            } else {
                clearInterval(tournamentCountdown);
                tournamentCountdown = null;
                startTournamentMode();
            }
        }, 1000);
    }
}

    function startTournamentMode() {
    isTournamentMode = true;
    
    // Fase 1: Parar partido y obtener lista de jugadores
    room.stopGame();
    
    let allPlayers = room.getPlayerList();
    
    // Separar los primeros 8 jugadores para el torneo y el resto a la lista de espera
    let tournamentPlayers = allPlayers.slice(0, 8);
    let waitingPlayers = allPlayers.slice(8);
    
    // Mover todos a espectador primero
    allPlayers.forEach(player => {
        room.setPlayerTeam(player.id, teams.SPECTATOR);
		
statsManager.startNewTournament();
    });

    room.sendAnnouncement("🏆 ¡MODO TORNEO INICIADO!", null, 0xFFFF00, "bold");
    room.sendAnnouncement("⚽ Configuración del torneo: 1 minuto por partido, sin límite de goles.", null, 0x00FF00);
    
    // Fase 2: Sorteo visual de grupos
    setTimeout(() => {
        room.sendAnnouncement("📋 Iniciando sorteo de grupos...", null, 0xFFFF00);
        
        // Mezclar solo los jugadores del torneo
        shufflePlayers(tournamentPlayers).forEach((player, index) => {
            const team = index < 4 ? teams.RED : teams.BLUE;
            room.setPlayerTeam(player.id, team);
        });

        // Mostrar grupos
        setTimeout(() => {
            room.sendAnnouncement("Grupo A (Rojo):", null, 0xFF0000);
            room.getPlayerList().filter(p => p.team === teams.RED).forEach(p => {
                room.sendAnnouncement(`• ${p.name}`, null, 0xFF0000);
            });
            
            room.sendAnnouncement("Grupo B (Azul):", null, 0x0000FF);
            room.getPlayerList().filter(p => p.team === teams.BLUE).forEach(p => {
                room.sendAnnouncement(`• ${p.name}`, null, 0x0000FF);
            });

            // Fase 3: Guardar grupos y preparar partidos
            setTimeout(() => {
                room.getPlayerList().forEach(player => {
                    room.setPlayerTeam(player.id, teams.SPECTATOR);
                });
                room.sendAnnouncement("✅ Sorteo de grupos finalizado.", null, 0x00FF00);
                
                saveTournamentGroups();
                createMatchSchedule();
                showGroupStandings();
                
                setTimeout(() => {
                    room.sendAnnouncement("🎮 ¡Comienza la fase de grupos!", null, 0x00FF00, "bold");
                    startTournamentMatch();
                }, 5000);
            }, 5000);
        }, 5000);
    }, 2000);
}

    // Funciones del torneo
    function shufflePlayers(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function saveTournamentGroups() {
        // Guardar los grupos cuando se hace el sorteo
        groupA = room.getPlayerList()
            .filter(p => p.team === teams.RED)
            .map(p => ({
                id: p.id,
                name: p.name,
                auth: p.auth,
                points: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                matchesPlayed: 0
            }));

        groupB = room.getPlayerList()
            .filter(p => p.team === teams.BLUE)
            .map(p => ({
                id: p.id,
                name: p.name,
                auth: p.auth,
                points: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                matchesPlayed: 0
            }));
    }

    function createMatchSchedule() {
    console.log("Debug - Creando calendario de partidos");
    matchSchedule = [];
        
    // Partidos del Grupo A
    matchSchedule.push(
        { group: 'A', player1: groupA[0], player2: groupA[1], matchNumber: 1 },
        { group: 'A', player1: groupA[2], player2: groupA[3], matchNumber: 2 },
        { group: 'A', player1: groupA[0], player2: groupA[2], matchNumber: 3 },
        { group: 'A', player1: groupA[1], player2: groupA[3], matchNumber: 4 },
        { group: 'A', player1: groupA[0], player2: groupA[3], matchNumber: 5 },
        { group: 'A', player1: groupA[1], player2: groupA[2], matchNumber: 6 }
    );

    // Partidos del Grupo B
    matchSchedule.push(
        { group: 'B', player1: groupB[0], player2: groupB[1], matchNumber: 7 },
        { group: 'B', player1: groupB[2], player2: groupB[3], matchNumber: 8 },
        { group: 'B', player1: groupB[0], player2: groupB[2], matchNumber: 9 },
        { group: 'B', player1: groupB[1], player2: groupB[3], matchNumber: 10 },
        { group: 'B', player1: groupB[0], player2: groupB[3], matchNumber: 11 },
        { group: 'B', player1: groupB[1], player2: groupB[2], matchNumber: 12 }
    );

    console.log("Debug - Calendario creado:", matchSchedule.map(m => 
        `Partido ${m.matchNumber}: ${m.player1.name} vs ${m.player2.name} (Grupo ${m.group})`
    ));
}
	
	function showGroupStandings(playerId = null) {
    // Ordenar grupos por puntos (y diferencia de goles si hay empate)
    const sortPlayers = (players) => {
        return players.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            let aDiff = a.goalsFor - a.goalsAgainst;
            let bDiff = b.goalsFor - b.goalsAgainst;
            if (bDiff !== aDiff) return bDiff - aDiff;
            return b.goalsFor - a.goalsFor;
        });
    };

    // Función auxiliar para enviar anuncios
    const sendAnnouncement = (message, color) => {
        room.sendAnnouncement(message, playerId, color);
    };

    // Mostrar encabezado
    sendAnnouncement("📊 TABLA DE POSICIONES", 0xFFFF00);
    
    // Mostrar Grupo A
    sendAnnouncement("🔴 GRUPO A", 0xFF0000);
    sendAnnouncement("👤 Jugador | ⚽ PJ | ✅ PTS | 🥅 GF | ❌ GC | 📈 DIF", 0xFFFFFF);
    
    sortPlayers(groupA).forEach((player, index) => {
        let goalDiff = player.goalsFor - player.goalsAgainst;
        let diffSymbol = goalDiff > 0 ? "+" : "";
        sendAnnouncement(
            `${index + 1}. ${player.name} | ${player.matchesPlayed} | ${player.points} | ${player.goalsFor} | ${player.goalsAgainst} | ${diffSymbol}${goalDiff}`,
            0xFFFFFF
        );
    });

    sendAnnouncement("────────────────────", 0xFFFFFF);
    
    // Mostrar Grupo B
    sendAnnouncement("🔵 GRUPO B", 0x0000FF);
    sendAnnouncement("👤 Jugador | ⚽ PJ | ✅ PTS | 🥅 GF | ❌ GC | 📈 DIF", 0xFFFFFF);
    
    sortPlayers(groupB).forEach((player, index) => {
        let goalDiff = player.goalsFor - player.goalsAgainst;
        let diffSymbol = goalDiff > 0 ? "+" : "";
        sendAnnouncement(
            `${index + 1}. ${player.name} | ${player.matchesPlayed} | ${player.points} | ${player.goalsFor} | ${player.goalsAgainst} | ${diffSymbol}${goalDiff}`,
            0xFFFFFF
        );
    });

    sendAnnouncement("────────────────────", 0xFFFFFF);
    sendAnnouncement("PJ: Partidos Jugados | PTS: Puntos | GF: Goles a Favor | GC: Goles en Contra | DIF: Diferencia", 0xFFFFFF);
}

    function startTournamentMatch() {
    if (isStartingMatch) {
        console.log("Debug - Evitando inicio duplicado de partido");
        return;
    }

    isStartingMatch = true;

    if (currentMatch >= matchSchedule.length) {
        console.log("Debug - Fin de la fase de grupos");
        room.sendAnnouncement("🎉 ¡Fase de grupos finalizada!", null, 0xFFFF00, "bold");
        isStartingMatch = false;
        return;
    }

    const match = matchSchedule[currentMatch];
    
    console.log(`Debug - Control de secuencia:`, {
        partidoActual: match.matchNumber,
        currentMatch,
        jugador1: match.player1.name,
        jugador2: match.player2.name,
        vacantes: Array.from(vacantPositions)
    });

    const player1Vacant = vacantPositions.has(match.player1.id);
    const player2Vacant = vacantPositions.has(match.player2.id);

    if (player1Vacant || player2Vacant) {
        let winner = player1Vacant ? match.player2 : match.player1;
        let loser = player1Vacant ? match.player1 : match.player2;

        handleDefaultVictory(winner, loser, match);
        currentMatch++;
        
        // Programar el siguiente partido
        setTimeout(() => {
            isStartingMatch = false;
            if (currentMatch < matchSchedule.length) {
                room.sendAnnouncement("⏳ Próximo partido en 10 segundos...", null, 0x00FF00);
                setTimeout(() => startTournamentMatch(), 10000);
            } else {
                startSemifinals();
            }
        }, 3000);
        return;
    }

    // Mover todos a espectador primero
    room.getPlayerList().forEach(p => {
        room.setPlayerTeam(p.id, teams.SPECTATOR);
    });

    // Asignar jugadores usando match.player1 y match.player2
    room.setPlayerTeam(match.player1.id, teams.RED);
    room.setPlayerTeam(match.player2.id, teams.BLUE);

    room.sendAnnouncement("──────────────────", null, 0xFFFFFF);
    room.sendAnnouncement(`🏆 Partido ${match.matchNumber}/${matchSchedule.length} - Grupo ${match.group}`, null, 0xFFFF00, "bold");
    room.sendAnnouncement(`🔴 ${match.player1.name} vs 🔵 ${match.player2.name}`, null, 0xFFFF00, "bold");
    room.sendAnnouncement("──────────────────", null, 0xFFFFFF);

    room.setTimeLimit(1);
    room.setScoreLimit(0);
    
    setTimeout(() => {
        isStartingMatch = false;
        room.startGame();
    }, 3000);
}

function handleDefaultVictory(winner, loser, match = null) {
    // Anunciar qué partido es
    room.sendAnnouncement("──────────────────", null, 0xFFFFFF);
    room.sendAnnouncement(`🏆 Partido ${match.matchNumber}/12 - Grupo ${match.group}`, null, 0xFFFF00, "bold");
    room.sendAnnouncement(`⚠️ Victoria por default:`, null, 0xFFFF00, "bold");
    room.sendAnnouncement(`${loser.name} no está disponible`, null, 0xFFFF00);
    room.sendAnnouncement(`${winner.name} gana 3-0`, null, 0x00FF00);
    room.sendAnnouncement("──────────────────", null, 0xFFFFFF);

    // Buscar los jugadores en los grupos correctos
    let winnerStats = groupA.find(p => p.id === winner.id) || groupB.find(p => p.id === winner.id);
    let loserStats = groupA.find(p => p.id === loser.id) || groupB.find(p => p.id === loser.id);

    console.log("Debug - Estadísticas antes de actualizar:", {
        winner: winnerStats ? `${winnerStats.name}: PJ=${winnerStats.matchesPlayed}` : 'no encontrado',
        loser: loserStats ? `${loserStats.name}: PJ=${loserStats.matchesPlayed}` : 'no encontrado'
    });

    // Actualizar estadísticas
    if (winnerStats) {
        winnerStats.matchesPlayed++;
        winnerStats.goalsFor += 3;
        winnerStats.points += 3;
    }
    
    if (loserStats) {
        loserStats.matchesPlayed++;
        loserStats.goalsAgainst += 3;
    }
}

	function getGroupQualifiers() {
    // Ordenar grupos por puntos y diferencia de goles
    const sortPlayers = (players) => {
        return players.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            let aDiff = a.goalsFor - a.goalsAgainst;
            let bDiff = b.goalsFor - b.goalsAgainst;
            if (bDiff !== aDiff) return bDiff - aDiff;
            return b.goalsFor - a.goalsFor;
        });
    };

    const sortedGroupA = sortPlayers([...groupA]);
    const sortedGroupB = sortPlayers([...groupB]);

    return {
        groupAFirst: sortedGroupA[0],
        groupASecond: sortedGroupA[1],
        groupBFirst: sortedGroupB[0],
        groupBSecond: sortedGroupB[1]
    };
}

function startSemifinals() {
    const qualifiers = getGroupQualifiers();
    
    // Primero, mover a todos a espectador
    room.getPlayerList().forEach(player => {
        room.setPlayerTeam(player.id, teams.SPECTATOR);
    });
    
    // Crear emparejamientos de semifinales
    matchSchedule = [
        {
            phase: 'SF',
            match: 1,
            player1: qualifiers.groupAFirst,
            player2: qualifiers.groupBSecond
        },
        {
            phase: 'SF',
            match: 2,
            player1: qualifiers.groupBFirst,
            player2: qualifiers.groupASecond
        }
    ];

    currentMatch = 0;
    
    // Anuncios del inicio de semifinales
    room.sendAnnouncement("🏆 COMIENZAN LAS SEMIFINALES", null, 0xFFFF00, "bold");
    room.sendAnnouncement("──────────────────", null, 0xFFFFFF);
    room.sendAnnouncement(`Semifinal 1: ${qualifiers.groupAFirst.name} 🆚 ${qualifiers.groupBSecond.name}`, null, 0xFFFF00);
    room.sendAnnouncement(`Semifinal 2: ${qualifiers.groupBFirst.name} 🆚 ${qualifiers.groupASecond.name}`, null, 0xFFFF00);
    room.sendAnnouncement("──────────────────", null, 0xFFFFFF);
    room.sendAnnouncement("⚽ Las semifinales se juegan hasta que haya un ganador", null, 0x00FF00);

    // Iniciar primera semifinal
    setTimeout(() => {
        startKnockoutMatch();
    }, 5000);
}

function startKnockoutMatch() {
    const match = matchSchedule[currentMatch];
    const { player1, player2, phase } = match;

    // Mover jugadores a sus posiciones y actualizar el Map
    room.setPlayerTeam(player1.id, teams.RED);
    playerTeams.set(player1.id, teams.RED);
    
    room.setPlayerTeam(player2.id, teams.BLUE);
    playerTeams.set(player2.id, teams.BLUE);

    // Anunciar el partido
    room.sendAnnouncement("──────────────────", null, 0xFFFFFF);
    room.sendAnnouncement(
        `🏆 ${phase === 'SF' ? 'SEMIFINAL' : 'FINAL'} ${phase === 'SF' ? match.match : ''}`, 
        null, 
        0xFFFF00, 
        "bold"
    );
    room.sendAnnouncement(`🔴 ${player1.name} vs 🔵 ${player2.name}`, null, 0xFFFF00, "bold");
    room.sendAnnouncement("⚠️ Partido a 1 minuto. En caso de empate, se jugará Gol de Oro.", null, 0xFFFF00);
    room.sendAnnouncement("──────────────────", null, 0xFFFFFF);

    // Configurar partido
    room.setTimeLimit(1);
    room.setScoreLimit(0);
    
    setTimeout(() => {
        room.startGame();
    }, 3000);
}

function updateTournamentStats(oldPlayer, newPlayer) {
    // Actualizar grupos
    let playerStats = null;
    let playerInGroupA = groupA.findIndex(p => p.id === oldPlayer.id);
    if (playerInGroupA !== -1) {
        playerStats = groupA[playerInGroupA];
        groupA[playerInGroupA] = {
            ...playerStats,
            id: newPlayer.id,
            name: newPlayer.name,
            auth: newPlayer.auth
        };
    }

    let playerInGroupB = groupB.findIndex(p => p.id === oldPlayer.id);
    if (playerInGroupB !== -1) {
        playerStats = groupB[playerInGroupB];
        groupB[playerInGroupB] = {
            ...playerStats,
            id: newPlayer.id,
            name: newPlayer.name,
            auth: newPlayer.auth
        };
    }

    // Actualizar matchSchedule
    matchSchedule.forEach(match => {
        if (match.player1?.id === oldPlayer.id) {
            match.player1 = {
                ...match.player1,
                id: newPlayer.id,
                name: newPlayer.name,
                auth: newPlayer.auth
            };
        } else if (match.player2?.id === oldPlayer.id) {
            match.player2 = {
                ...match.player2,
                id: newPlayer.id,
                name: newPlayer.name,
                auth: newPlayer.auth
            };
        }
    });

    // Mostrar estadísticas heredadas
    if (playerStats) {
        room.sendAnnouncement(`📊 ${newPlayer.name} hereda las estadísticas:`, null, 0x00FF00);
        room.sendAnnouncement(`Puntos: ${playerStats.points}, Goles: ${playerStats.goalsFor}, Partidos: ${playerStats.matchesPlayed}`, null, 0x00FF00);
    }
}

function handleKnockoutVictory(scores) {
    const match = matchSchedule[currentMatch];
    const { player1, player2, phase } = match;
    const winner = scores.red > scores.blue ? player1 : player2;
    const loser = scores.red > scores.blue ? player2 : player1;

    if (phase === 'SF') {
        // Guardar ganador para la final
        if (match.match === 1) {
            semifinal1Winner = winner;
        } else {
            semifinal2Winner = winner;
        }

        room.sendAnnouncement(`🎉 ¡${winner.name} avanza a la final!`, null, 0xFFFF00, "bold");
        
        // Si es la segunda semifinal, preparar la final
        if (match.match === 2) {
            // Primero mover todos a espectador
            room.getPlayerList().forEach(p => {
                room.setPlayerTeam(p.id, teams.SPECTATOR);
            });

            matchSchedule = [{
                phase: 'F',
                player1: semifinal1Winner,
                player2: semifinal2Winner
            }];
            currentMatch = 0;

            room.sendAnnouncement("⏳ La final comenzará en 15 segundos...", null, 0x00FF00);
            room.sendAnnouncement("──────────────────", null, 0xFFFFFF);
            room.sendAnnouncement("🏆 FINAL", null, 0xFFFF00, "bold");
            room.sendAnnouncement(`${semifinal1Winner.name} 🆚 ${semifinal2Winner.name}`, null, 0xFFFF00);
            room.sendAnnouncement("──────────────────", null, 0xFFFFFF);

            setTimeout(() => {
                startKnockoutMatch();
            }, 15000);
        } else {
            // Preparar segunda semifinal
            // Mover todos a espectador antes de la siguiente semi
            room.getPlayerList().forEach(p => {
                room.setPlayerTeam(p.id, teams.SPECTATOR);
            });
            
            currentMatch++;
            room.sendAnnouncement("⏳ Segunda semifinal en 10 segundos...", null, 0x00FF00);
            setTimeout(() => {
                startKnockoutMatch();
            }, 10000);
        }
    } else if (phase === 'F') {
        // Final del torneo
        room.sendAnnouncement("──────────────────", null, 0xFFFFFF);
        room.sendAnnouncement("🏆 ¡FINAL DEL TORNEO!", null, 0xFFFF00, "bold");
        room.sendAnnouncement(`¡${winner.name} ES EL CAMPEÓN!`, null, 0xFFFF00, "bold");
        room.sendAnnouncement(`Resultado final: 🔴 ${scores.red} - ${scores.blue} 🔵`, null, 0xFFFF00);
        room.sendAnnouncement("──────────────────", null, 0xFFFFFF);
        
        isTournamentMode = false;
    }
}

// Función para resetear la actividad de un jugador
function resetPlayerActivity(playerId) {
    playerActivity.set(playerId, Date.now());
}

// Función para verificar si un jugador está en partido activo
function isInActiveGame(playerId) {
    const player = room.getPlayerList().find(p => p.id === playerId);
    const scores = room.getScores();
    return player && player.team !== teams.SPECTATOR && scores !== null && !isGamePaused;
}

// Función para verificar movimiento del jugador
function checkPlayerMovement(player) {
    if (!player || !player.position) {
        return false;
    }

    if (!lastPlayerPositions.has(player.id)) {
        lastPlayerPositions.set(player.id, { x: player.position.x, y: player.position.y });
        return false;
    }

    const lastPos = lastPlayerPositions.get(player.id);
    const hasMoved = lastPos.x !== player.position.x || lastPos.y !== player.position.y;
    
    lastPlayerPositions.set(player.id, { x: player.position.x, y: player.position.y });
    return hasMoved;
}

// Función principal para verificar AFK
function checkAFKPlayers() {
    const currentTime = Date.now();
    const players = room.getPlayerList().filter(p => p.team !== teams.SPECTATOR);
    
    players.forEach(player => {
        // Solo verificar jugadores en partido activo
        if (!isInActiveGame(player.id)) {
            resetPlayerActivity(player.id);
            return;
        }

        // Verificar movimiento
        if (player.position && checkPlayerMovement(player)) {
            resetPlayerActivity(player.id);
            return;
        }

        // Si no hay registro de actividad, inicializarlo
        if (!playerActivity.has(player.id)) {
            resetPlayerActivity(player.id);
            return;
        }

        const lastActivity = playerActivity.get(player.id);
        const inactiveTime = currentTime - lastActivity;

        // Advertencia a los 15 segundos
        if (inactiveTime >= AFK_WARNING_TIME && inactiveTime < AFK_TIMEOUT) {
            room.sendAnnouncement(
                `⚠️ ¡ATENCIÓN! Estás AFK! Tienes ${Math.ceil((AFK_TIMEOUT - inactiveTime)/1000)} segundos para moverte o serás expulsado.`,
                player.id,
                0xFF9900
            );
        }
        // Kickear a los 20 segundos
        else if (inactiveTime >= AFK_TIMEOUT) {
            const playerTeam = player.team;
            
            // Si está en modo torneo, manejar el reemplazo antes del kick
            if (isTournamentMode) {
                handlePlayerDisconnection(player, playerTeam);
            }
            
            // Anunciar y kickear
            room.sendAnnouncement(`🚫 ${player.name} ha sido expulsado por AFK`, null, 0xFF0000);
            room.kickPlayer(player.id, "AFK - Inactivo por más de 20 segundos", false);
        }
    });
}
	
	// Justo después de las otras funciones de utilidad y antes de los eventos
function handlePlayerDisconnection(player, playerTeam) {
    if (!isTournamentMode || isStartingMatch) return;

    vacantPositions.add(player.id);
    
    // Si el jugador estaba en un partido activo, actualizar sus estadísticas
    const currentMatchData = matchSchedule[currentMatch];
    if (currentMatchData && room.getScores() !== null) {
        let playerStats = groupA.find(p => p.id === player.id) || groupB.find(p => p.id === player.id);
        if (playerStats) {
            playerStats.matchesPlayed++;  // Contamos el partido
            playerStats.goalsAgainst += 3;  // Sumamos los goles en contra de la derrota por default
        }
    }

    if (waitingList.length > 0) {
        // Código existente para cuando hay suplente...
    } else {
        room.pauseGame(true);
        waitingForReplacement = true;
        abandonedTeam = playerTeam;
        
        if (replacementTimeout) {
            clearTimeout(replacementTimeout);
        }
        
        replacementTimeout = setTimeout(() => {
            if (waitingForReplacement) {
                waitingForReplacement = false;
                
                // En lugar de procesar la victoria aquí, vamos a dejar que startTournamentMatch lo haga
                room.stopGame();
                
                // Solo programar el siguiente partido
                setTimeout(() => {
                    if (currentMatch < matchSchedule.length) {
                        startTournamentMatch();
                    } else {
                        startSemifinals();
                    }
                }, 5000);
            }
        }, 30000);
    }
}
	
	
	// Función para formatear el tiempo
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Función para seleccionar mensaje aleatorio
function getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}
	
	// Comandos
    const commands = {
        "!admin": (player, args) => {
            if (!args || args.length === 0) {
                room.sendAnnouncement("🔑 Uso correcto: !admin [contraseña]", player.id, 0xFF0000);
                return;
            }

            const password = args[0];
            if (password === ADMIN_PASSWORD) {
                room.setPlayerAdmin(player.id, true);
                adminIds.add(player.id);
                room.sendAnnouncement(`${player.name} es ahora administrador.`, null, 0x00FF00, 'bold');
            } else {
                room.sendAnnouncement("❌ Contraseña incorrecta.", player.id, 0xFF0000);
            }
        },
        "!clearban": (player) => {
            if (isAdmin(player)) {
                room.clearBans();
                room.sendAnnouncement("Todos los baneos han sido removidos.", null, 0x00FF00);
            } else {
                room.sendAnnouncement("¡No tienes permisos de administrador!", player.id, 0xFF0000);
            }
        },
        "!rr": (player) => {
            if (isAdmin(player)) {
                room.stopGame();
                room.startGame();
            } else {
                room.sendAnnouncement("¡No tienes permisos de administrador!", player.id, 0xFF0000);
            }
        },
		"!testsemi": (player) => {
    if (isAdmin(player)) {
        // Verificar que haya al menos 4 jugadores
        const players = room.getPlayerList();
        if (players.length < 4) {
            room.sendAnnouncement("❌ Se necesitan al menos 4 jugadores para testear las semifinales.", player.id, 0xFF0000);
            return;
        }

        // Detener cualquier juego en curso
        room.stopGame();

        // Mover todos a espectador primero
        players.forEach(p => room.setPlayerTeam(p.id, teams.SPECTATOR));

        // Seleccionar 4 jugadores aleatorios
        const testPlayers = shufflePlayers(players.slice()).slice(0, 4);

        // Crear grupos ficticios para el test
        groupA = [
            {
                id: testPlayers[0].id,
                name: testPlayers[0].name,
                auth: testPlayers[0].auth,
                points: 9,
                goalsFor: 10,
                goalsAgainst: 3,
                matchesPlayed: 3
            },
            {
                id: testPlayers[1].id,
                name: testPlayers[1].name,
                auth: testPlayers[1].auth,
                points: 6,
                goalsFor: 8,
                goalsAgainst: 5,
                matchesPlayed: 3
            }
        ];

        groupB = [
            {
                id: testPlayers[2].id,
                name: testPlayers[2].name,
                auth: testPlayers[2].auth,
                points: 9,
                goalsFor: 12,
                goalsAgainst: 4,
                matchesPlayed: 3
            },
            {
                id: testPlayers[3].id,
                name: testPlayers[3].name,
                auth: testPlayers[3].auth,
                points: 6,
                goalsFor: 7,
                goalsAgainst: 6,
                matchesPlayed: 3
            }
        ];

        // Activar modo torneo
        isTournamentMode = true;

        // Anunciar el inicio del test
        room.sendAnnouncement("🧪 INICIANDO MODO TEST DE SEMIFINALES", null, 0xFFFF00, "bold");
        room.sendAnnouncement("Los siguientes jugadores han sido seleccionados aleatoriamente:", null, 0x00FF00);
        testPlayers.forEach((p, index) => {
            room.sendAnnouncement(`${index + 1}. ${p.name}`, null, 0x00FF00);
        });

        // Iniciar semifinales
        setTimeout(() => {
            startSemifinals();
        }, 3000);
    } else {
        room.sendAnnouncement("❌ ¡No tienes permisos de administrador!", player.id, 0xFF0000);
    }
		},
		"!testfinal": (player) => {
    if (isAdmin(player)) {
        const players = room.getPlayerList();
        if (players.length < 2) {
            room.sendAnnouncement("❌ Se necesitan al menos 2 jugadores para testear la final.", player.id, 0xFF0000);
            return;
        }

        room.stopGame();
        players.forEach(p => room.setPlayerTeam(p.id, teams.SPECTATOR));

        // Seleccionar 2 jugadores aleatorios
        const testPlayers = shufflePlayers(players.slice()).slice(0, 2);

        // Configurar ganadores de semifinales ficticios
        semifinal1Winner = {
            id: testPlayers[0].id,
            name: testPlayers[0].name,
            auth: testPlayers[0].auth
        };

        semifinal2Winner = {
            id: testPlayers[1].id,
            name: testPlayers[1].name,
            auth: testPlayers[1].auth
        };

        // Configurar el torneo para la final
        isTournamentMode = true;
        matchSchedule = [{
            phase: 'F',
            player1: semifinal1Winner,
            player2: semifinal2Winner
        }];
        currentMatch = 0;

        // Anunciar el inicio del test
        room.sendAnnouncement("🧪 INICIANDO MODO TEST DE FINAL", null, 0xFFFF00, "bold");
        room.sendAnnouncement(`Finalistas seleccionados: ${testPlayers[0].name} vs ${testPlayers[1].name}`, null, 0x00FF00);

        // Iniciar la final
        setTimeout(() => {
            startKnockoutMatch();
        }, 3000);
    } else {
        room.sendAnnouncement("❌ ¡No tienes permisos de administrador!", player.id, 0xFF0000);
    }
},
"!bb": (player) => {
    // Obtener el equipo actual del jugador antes de kickearlo
    const currentTeam = player.team;
    
    // Si está en modo torneo y está en un partido activo
    if (isTournamentMode && currentTeam !== teams.SPECTATOR) {
        // Guardar la información antes del kick
        abandonedTeam = currentTeam;
        currentScores = room.getScores();
        
        // Pausar el juego si está activo
        if (currentScores !== null) {
            room.pauseGame(true);
        }
        
        // Registrar posición vacante
        vacantPositions.add(player.id);
        
        // Iniciar proceso de reemplazo
        handlePlayerDisconnection(player, currentTeam);
    }
    
    // Ejecutar el kick y anuncio
    room.kickPlayer(player.id, "¡Hasta pronto!", false);
    room.sendAnnouncement(
        `👋 ${player.name} se ha despedido. ¡Hasta pronto!`,
        null,
        0x00FF00
    );
},
"!grupos": (player) => {
    if (isTournamentMode) {
        showGroupStandings(player.id);
    } else {
        room.sendAnnouncement("❌ El torneo no ha comenzado aún.", player.id, 0xFF0000);
    }
},

"!stats": (player) => {
    if (!player.auth) {
        room.sendAnnouncement("❌ Necesitas estar autenticado para ver tus estadísticas.", player.id, 0xFF0000);
        return;
    }
    
    const stats = statsManager.formatStats(player.auth, player.name);
    stats.forEach(line => {
        room.sendAnnouncement(line, player.id, 0x00FF00);
    });
},

"!statsof": (player, args) => {
    if (!args || args.length === 0) {
        room.sendAnnouncement("❌ Uso: !statsof [nombre]", player.id, 0xFF0000);
        return;
    }

    const targetName = args.join(" ");
    const targetPlayer = room.getPlayerList().find(p => p.name === targetName);

    if (!targetPlayer || !targetPlayer.auth) {
        room.sendAnnouncement(`❌ No se encontró al jugador "${targetName}" o no está autenticado.`, player.id, 0xFF0000);
        return;
    }

    const stats = statsManager.formatStats(targetPlayer.auth, targetPlayer.name);
    stats.forEach(line => {
        room.sendAnnouncement(line, player.id, 0x00FF00);
    });
},

"!ranking": (player) => {
    const stats = statsManager.getRanking();
    room.sendAnnouncement("🏆 RANKING GLOBAL", player.id, 0xFFFF00);
    room.sendAnnouncement("──────────────────", player.id, 0xFFFFFF);
    stats.forEach((stat, index) => {
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "  ";
        room.sendAnnouncement(
            `${medal} ${index + 1}. ${stat.name}: ${stat.torneosGanados} torneos, ${stat.winRate}% victorias`,
            player.id,
            0x00FF00
        );
    });
}

    };
	

    // Eventos
    room.onRoomLink = (link) => {
        console.log("\n🔗 Enlace de la sala:", link, "\n");
    };

    room.onPlayerJoin = (player) => {
   if (!isTournamentMode) {
       room.sendAnnouncement(`👋 ¡Bienvenido ${player.name}!`, null, 0x00FF00);
       
       const playerCount = room.getPlayerList().length;
       
       if (playerCount <= TOURNAMENT_SIZE) {
           // Asignar equipo automáticamente
           const teamToJoin = assignPlayerTeam();
           room.setPlayerTeam(player.id, teamToJoin);
           
           const teamName = teamToJoin === teams.RED ? "🔴 Rojo" : "🔵 Azul";
           room.sendAnnouncement(
               `${player.name} ha sido asignado al equipo ${teamName}`,
               null,
               0x00FF00
           );

           // Iniciar partido automáticamente si es el primer jugador
           if (playerCount === 1) {
               setTimeout(() => {
                   room.startGame();
               }, 1000);
           }
       } else {
           // Si hay más de 8 jugadores, añadir a la lista de espera
           waitingList.push({
               id: player.id,
               name: player.name,
               auth: player.auth
           });
           // Agregar al jugador al Map de seguimiento
           playerTeams.set(player.id, teams.SPECTATOR);
           room.setPlayerTeam(player.id, teams.SPECTATOR);
           room.sendAnnouncement(`📋 ${player.name} ha sido añadido a la lista de espera en posición #${waitingList.length}`, null, 0xFFFF00);
       }

       // Verificar si se debe iniciar el modo torneo
       checkTournamentStart();
   } else {
       // En modo torneo, verificar si hay posiciones vacantes
       if (vacantPositions.size > 0) {
           let vacantId = Array.from(vacantPositions)[0];
           vacantPositions.delete(vacantId);

           // Buscar los datos del jugador que se fue
           let replacedStats = null;

           // Buscar en grupo A
           let playerInGroupA = groupA.findIndex(p => p.id === vacantId);
           if (playerInGroupA !== -1) {
               replacedStats = groupA[playerInGroupA];
               groupA[playerInGroupA] = {
                   ...replacedStats,
                   id: player.id,
                   name: player.name,
                   auth: player.auth
               };
           }

           // Buscar en grupo B
           let playerInGroupB = groupB.findIndex(p => p.id === vacantId);
           if (playerInGroupB !== -1) {
               replacedStats = groupB[playerInGroupB];
               groupB[playerInGroupB] = {
                   ...replacedStats,
                   id: player.id,
                   name: player.name,
                   auth: player.auth
               };
           }

           // Actualizar matchSchedule
           matchSchedule.forEach(match => {
               if (match.player1?.id === vacantId) {
                   match.player1 = {
                       ...match.player1,
                       id: player.id,
                       name: player.name,
                       auth: player.auth
                   };
               } else if (match.player2?.id === vacantId) {
                   match.player2 = {
                       ...match.player2,
                       id: player.id,
                       name: player.name,
                       auth: player.auth
                   };
               }
           });

           // Si estábamos esperando un reemplazo para un partido en curso
           if (waitingForReplacement) {
               clearTimeout(replacementTimeout); // Cancelar el timeout de victoria por default
               waitingForReplacement = false;

               // Mover al nuevo jugador al equipo correspondiente
               room.setPlayerTeam(player.id, abandonedTeam);
               playerTeams.set(player.id, abandonedTeam);

               let teamName = abandonedTeam === teams.RED ? "🔴 Rojo" : "🔵 Azul";
               room.sendAnnouncement(`⚽ ${player.name} reemplaza al jugador que se fue en el equipo ${teamName}`, null, 0x00FF00, "bold");
               
               // Dar tiempo al jugador para prepararse
               setTimeout(() => {
                   room.sendAnnouncement("▶️ ¡Reanudando partido!", null, 0x00FF00);
                   room.pauseGame(false);
               }, 3000);
           } else {
               room.setPlayerTeam(player.id, teams.SPECTATOR);
               playerTeams.set(player.id, teams.SPECTATOR);
           }

           room.sendAnnouncement(`🔄 ${player.name} ha ocupado una posición vacante en el torneo`, null, 0x00FF00, "bold");
           if (replacedStats) {
               room.sendAnnouncement(`📊 Hereda las siguientes estadísticas:`, null, 0x00FF00);
               room.sendAnnouncement(`Puntos: ${replacedStats.points}, Goles: ${replacedStats.goalsFor}, Partidos: ${replacedStats.matchesPlayed}`, null, 0x00FF00);
           }
       } else {
           // Si no hay posiciones vacantes, añadir a la lista de espera
           waitingList.push({
               id: player.id,
               name: player.name,
               auth: player.auth
           });
           playerTeams.set(player.id, teams.SPECTATOR);
           room.setPlayerTeam(player.id, teams.SPECTATOR);
           room.sendAnnouncement(`👋 ¡Bienvenido ${player.name}! El torneo está en curso.`, null, 0x00FF00);
           room.sendAnnouncement(`📋 Has sido añadido a la lista de espera en posición #${waitingList.length}`, null, 0xFFFF00);
       }
   }
   resetPlayerActivity(player.id);
};


    room.onPlayerLeave = (player) => {
    adminIds.delete(player.id);
    
    // Si estamos en modo torneo
    if (isTournamentMode) {
        // Verificar si el jugador estaba en un partido activo mirando los scores
        let isActiveMatch = room.getScores() !== null;
        let activeTeam = null;
        
        if (isActiveMatch) {
            // Obtener la lista de jugadores antes de que se desconecte
            const activePlayers = room.getPlayerList();
            const activePlayer = activePlayers.find(p => p.id === player.id);
            if (activePlayer) {
                activeTeam = activePlayer.team;
            }
        }

        console.log(`Debug - Verificación de partido activo:`, {
            isActiveMatch,
            activeTeam,
            currentMatch
        });

        // Verificar si estaba en el torneo (grupos y matchSchedule)
        let isInTournament = groupA.some(p => p.id === player.id) || 
                            groupB.some(p => p.id === player.id) ||
                            matchSchedule.some(m => m.player1?.id === player.id || m.player2?.id === player.id);
        
        // Verificar si estaba en lista de espera
        let waitingIndex = waitingList.findIndex(p => p.id === player.id);
        let wasInWaitingList = waitingIndex !== -1;

        // Si estaba en lista de espera, removerlo
        if (wasInWaitingList) {
            waitingList.splice(waitingIndex, 1);
            room.sendAnnouncement(`📋 ${player.name} ha sido removido de la lista de espera.`, null, 0xFFFF00);
            
            // Actualizar la lista de espera
            if (waitingList.length > 0) {
                room.sendAnnouncement("📋 Lista de espera actualizada:", null, 0xFFFF00);
                waitingList.forEach((p, index) => {
                    room.sendAnnouncement(`${index + 1}. ${p.name}`, null, 0xFFFF00);
                });
            }
        }

        if (isInTournament) {
            if (isActiveMatch && activeTeam !== teams.SPECTATOR && waitingList.length === 0) {
                // No hay suplentes inmediatos, pausar el partido y esperar
                room.pauseGame(true);
                
                // Guardar información del partido y jugador que se fue
                currentScores = room.getScores();
                abandonedMatch = currentMatch;
                abandonedTeam = activeTeam;
                waitingForReplacement = true;

                room.sendAnnouncement("⚠️ Partido en pausa: Jugador desconectado", null, 0xFF0000, "bold");
                room.sendAnnouncement(`⏳ Esperando 30 segundos por un reemplazo para ${player.name}...`, null, 0xFFA500);

                // Registrar posición vacante
                vacantPositions.add(player.id);
                room.sendAnnouncement("El próximo jugador que entre ocupará este lugar y el partido continuará.", null, 0xFFA500);

                // Iniciar temporizador para victoria por default
                replacementTimeout = setTimeout(() => {
                    waitingForReplacement = false;
                    
                    // Asignar como ganador al jugador que NO se fue
                    let winner = activeTeam === teams.RED ? matchSchedule[currentMatch].player2 : matchSchedule[currentMatch].player1;
                    if (activeTeam === teams.BLUE) {
                        winner = matchSchedule[currentMatch].player1;  // Si se fue el BLUE, gana el RED
                    }
                    
                    room.stopGame();
                    room.sendAnnouncement(`⚠️ No se encontró reemplazo para ${player.name}`, null, 0xFF0000);
                    room.sendAnnouncement(`${winner.name} gana 3-0 por default`, null, 0x00FF00);

                    // Actualizar estadísticas del ganador correcto
                    winner.matchesPlayed++;
                    winner.goalsFor += 3;
                    winner.points += 3;

                    // Mostrar tabla actualizada
                    showGroupStandings();

                    // Mover al ganador a espectador
                    room.getPlayerList().forEach(p => {
                        room.setPlayerTeam(p.id, teams.SPECTATOR);
                    });

                    // Preparar siguiente partido
                    currentMatch++;
                    setTimeout(() => {
                        startTournamentMatch();
                    }, 5000);
                }, 30000);
            } else if (waitingList.length > 0) {
                // Hay suplentes disponibles
                let replacement = waitingList.shift();
                console.log(`Debug - Sustituto: ${replacement.name}`);

                if (isActiveMatch && activeTeam !== teams.SPECTATOR) {
                    room.pauseGame(true);
                    room.sendAnnouncement("⏸️ Sustitución de jugador...", null, 0xFFA500);
                    
                    room.setPlayerTeam(replacement.id, activeTeam);
                    playerTeams.set(replacement.id, activeTeam);
                    
                    let teamName = activeTeam === teams.RED ? "🔴 Rojo" : "🔵 Azul";
                    room.sendAnnouncement(`⚽ ${replacement.name} reemplaza a ${player.name} en el equipo ${teamName}`, null, 0x00FF00, "bold");
                    
                    setTimeout(() => {
                        room.sendAnnouncement("▶️ ¡Reanudando partido!", null, 0x00FF00);
                        room.pauseGame(false);
                    }, 3000);
                } else {
                    room.sendAnnouncement(`🔄 ${replacement.name} ha sustituido a ${player.name} en el torneo`, null, 0x00FF00, "bold");
                    playerTeams.set(replacement.id, teams.SPECTATOR);
                }

                // Actualizar estadísticas
                let playerStats = null;

                // Buscar en grupo A
                let playerInGroupA = groupA.findIndex(p => p.id === player.id);
                if (playerInGroupA !== -1) {
                    playerStats = groupA[playerInGroupA];
                    groupA[playerInGroupA] = {
                        ...playerStats,
                        id: replacement.id,
                        name: replacement.name,
                        auth: replacement.auth
                    };
                }

                // Buscar en grupo B
                let playerInGroupB = groupB.findIndex(p => p.id === player.id);
                if (playerInGroupB !== -1) {
                    playerStats = groupB[playerInGroupB];
                    groupB[playerInGroupB] = {
                        ...playerStats,
                        id: replacement.id,
                        name: replacement.name,
                        auth: replacement.auth
                    };
                }

                // Actualizar matchSchedule
                matchSchedule.forEach(match => {
                    if (match.player1?.id === player.id) {
                        match.player1 = {
                            ...match.player1,
                            id: replacement.id,
                            name: replacement.name,
                            auth: replacement.auth
                        };
                    } else if (match.player2?.id === player.id) {
                        match.player2 = {
                            ...match.player2,
                            id: replacement.id,
                            name: replacement.name,
                            auth: replacement.auth
                        };
                    }
                });

                // Mostrar estadísticas heredadas
                if (playerStats) {
                    room.sendAnnouncement(`📊 ${replacement.name} hereda las estadísticas:`, null, 0x00FF00);
                    room.sendAnnouncement(`Puntos: ${playerStats.points}, Goles: ${playerStats.goalsFor}, Partidos: ${playerStats.matchesPlayed}`, null, 0x00FF00);
                }

                // Actualizar la lista de espera
                if (waitingList.length > 0) {
                    room.sendAnnouncement("📋 Lista de espera actualizada:", null, 0xFFFF00);
                    waitingList.forEach((p, index) => {
                        room.sendAnnouncement(`${index + 1}. ${p.name}`, null, 0xFFFF00);
                    });
                }
            } else {
                // No hay suplentes y no estaba en partido activo
                vacantPositions.add(player.id);
                room.sendAnnouncement("⚠️ Posición vacante en el torneo. El próximo jugador que entre ocupará este lugar.", null, 0xFF0000);
            }
        }
    }

    room.sendAnnouncement(`👋 ${player.name} ha dejado la sala.`, null, 0xFF0000);

    // Manejar modo no torneo
    if (!isTournamentMode) {
        setTimeout(() => {
            balanceTeams();
        }, 500);

        if (tournamentCountdown && room.getPlayerList().length < PLAYERS_NEEDED_FOR_TOURNAMENT) {
            clearInterval(tournamentCountdown);
            tournamentCountdown = null;
            room.sendAnnouncement("❌ Cuenta regresiva del torneo cancelada - No hay suficientes jugadores.", null, 0xFF0000);
        }
    }
	playerActivity.delete(player.id);
    lastPlayerPositions.delete(player.id);
};

    room.onPlayerChat = (player, message) => {
    if (message.startsWith("!")) {
        const [command, ...args] = message.split(" ");
        if (commands[command]) {
            commands[command](player, args);
        } else {
            // Opcionalmente, informar al jugador si el comando no existe
            room.sendAnnouncement("❌ Comando no reconocido.", player.id, 0xFF0000);
        }
        return false; // Esto evitará que cualquier mensaje que empiece con ! se muestre
    }
    return true; // Los mensajes normales se mostrarán
};
	
	room.onTeamGoal = (team) => {
    const scores = room.getScores();
    const goalTime = formatTime(scores.time);
    
    // Usar lastPlayerTouch en lugar de scores.lastPlayerId
    if (lastPlayerTouch) {
        const isOwnGoal = lastPlayerTouch.team !== team;
        
        if (isOwnGoal) {
            const message = getRandomMessage(ownGoalMessages)
                .replace('{player}', lastPlayerTouch.name)
                .replace('{time}', goalTime);
            room.sendAnnouncement(message, null, 0xFF9000);
        } else {
            const message = getRandomMessage(goalMessages)
                .replace('{player}', lastPlayerTouch.name)
                .replace('{time}', goalTime);
            room.sendAnnouncement(message, null, 0x00FF00);
        }
    }

    // Resetear el último toque después del gol
    lastPlayerTouch = null;

    if (isTournamentMode) {
        const match = matchSchedule[currentMatch];
        
        // Si es semifinal o final y estamos en overtime
        if ((match.phase === 'SF' || match.phase === 'F') && scores.time >= 60) {
            room.sendAnnouncement("🎯 ¡GOL DE ORO!", null, 0xFFFF00, "bold");
            
            setTimeout(() => {
                const finalScores = room.getScores();
                handleKnockoutVictory(finalScores);
                room.stopGame();
            }, 2000);
        }
    }
};
	room.onTeamChange = (changedPlayer, byPlayer) => {
    if (changedPlayer.team !== teams.SPECTATOR) {
        playerTeams.set(changedPlayer.id, changedPlayer.team);
        console.log(`Debug - Team Change: ${changedPlayer.name} moved to team ${changedPlayer.team}`);
    } else {
        playerTeams.delete(changedPlayer.id);
        console.log(`Debug - Team Change: ${changedPlayer.name} moved to spectator`);
    }
    console.log('Debug - Current playerTeams Map:', Array.from(playerTeams.entries()));
};

    room.onTeamVictory = (scores) => {
    if (!isTournamentMode) {
        // Modo pre-torneo
        const winner = scores.red > scores.blue ? "🔴 Rojo" : "🔵 Azul";
        room.sendAnnouncement(
            `¡${winner} ha ganado! Resultado final: 🔴 ${scores.red} - ${scores.blue} 🔵`,
            null,
            0xFFFF00
        );
        
        // Primero detener el partido
        room.stopGame();
        
        // Esperar a que el partido esté completamente detenido
        setTimeout(() => {
            // Recolectar jugadores activos
            const players = room.getPlayerList();
            const activePlayers = players.filter(p => p.team !== teams.SPECTATOR);
            
            // Mover todos a espectador primero
            players.forEach(p => room.setPlayerTeam(p.id, teams.SPECTATOR));
            
            // Mezclar aleatoriamente los jugadores activos
            const shuffledPlayers = shufflePlayers([...activePlayers]);
            
            // Asignar equipos alternadamente
            shuffledPlayers.forEach((p, index) => {
                const teamToJoin = index % 2 === 0 ? teams.RED : teams.BLUE;
                room.setPlayerTeam(p.id, teamToJoin);
            });
            
            // Comenzar nuevo partido
            setTimeout(() => {
                room.startGame();
            }, 2000);
        }, 1000);
    } else if (matchSchedule[currentMatch].phase === 'SF') {
        const match = matchSchedule[currentMatch];
        const { player1, player2 } = match;

        // Actualizar estadísticas de semifinal
        if (player1?.auth) {
            statsManager.updateMatchStats(player1.auth, {
                golesMarcados: scores.red,
                golesRecibidos: scores.blue,
                victoria: scores.red > scores.blue,
                fase: 'semis'
            });
        }
        
        if (player2?.auth) {
            statsManager.updateMatchStats(player2.auth, {
                golesMarcados: scores.blue,
                golesRecibidos: scores.red,
                victoria: scores.blue > scores.red,
                fase: 'semis'
            });
        }

        const winner = scores.red > scores.blue ? player1 : player2;
        
        // Guardar ganador para la final
        if (match.match === 1) {
            semifinal1Winner = winner;
            room.sendAnnouncement(`🎉 ¡${winner.name} avanza a la final!`, null, 0xFFFF00, "bold");
        } else {
            semifinal2Winner = winner;
            room.sendAnnouncement(`🎉 ¡${winner.name} avanza a la final!`, null, 0xFFFF00, "bold");
        }

        room.sendAnnouncement(`Resultado final: 🔴 ${scores.red} - ${scores.blue} 🔵`, null, 0xFFFF00);

        // Preparar siguiente semifinal o la final
        currentMatch++;
        if (currentMatch < matchSchedule.length) {
            // Aún queda una semifinal
            room.sendAnnouncement("⏳ Segunda semifinal en 10 segundos...", null, 0x00FF00);
            setTimeout(() => {
                room.getPlayerList().forEach(p => {
                    room.setPlayerTeam(p.id, teams.SPECTATOR);
                });
                startKnockoutMatch();
            }, 10000);
        } else {
            // Preparar la final
            matchSchedule = [{
                phase: 'F',
                player1: semifinal1Winner,
                player2: semifinal2Winner
            }];
            currentMatch = 0;

            room.sendAnnouncement("──────────────────", null, 0xFFFFFF);
            room.sendAnnouncement("🏆 GRAN FINAL", null, 0xFFFF00, "bold");
            room.sendAnnouncement(`${semifinal1Winner.name} 🆚 ${semifinal2Winner.name}`, null, 0xFFFF00);
            room.sendAnnouncement("──────────────────", null, 0xFFFFFF);

            setTimeout(() => {
                room.getPlayerList().forEach(p => {
                    room.setPlayerTeam(p.id, teams.SPECTATOR);
                });
                startKnockoutMatch();
            }, 10000);
        }
    } else if (matchSchedule[currentMatch].phase === 'F') {
        const match = matchSchedule[currentMatch];
        const { player1, player2 } = match;
        const winner = scores.red > scores.blue ? player1 : player2;
        const loser = scores.red > scores.blue ? player2 : player1;

        // Actualizar estadísticas del partido final
        if (player1?.auth) {
            statsManager.updateMatchStats(player1.auth, {
                golesMarcados: scores.red,
                golesRecibidos: scores.blue,
                victoria: scores.red > scores.blue,
                fase: 'final'
            });
        }
        
        if (player2?.auth) {
            statsManager.updateMatchStats(player2.auth, {
                golesMarcados: scores.blue,
                golesRecibidos: scores.red,
                victoria: scores.blue > scores.red,
                fase: 'final'
            });
        }

        // Actualizar estadísticas finales del torneo
        const allPlayers = [...groupA, ...groupB];
        allPlayers.forEach(player => {
            if (player.auth) {
                const isGroupA = groupA.some(p => p.id === player.id);
                const group = isGroupA ? groupA : groupB;
                const posicionGrupo = group.findIndex(p => p.id === player.id) + 1;

                let posicionFinal;
                if (player.id === winner.id) posicionFinal = 1;
                else if (player.id === loser.id) posicionFinal = 2;
                else if (player.id === semifinal1Winner?.id || player.id === semifinal2Winner?.id) posicionFinal = 3;
                else posicionFinal = 5;

                statsManager.updateTournamentStats(player.auth, {
                    posicionGrupo,
                    posicionFinal,
                    llegoSemis: posicionFinal <= 4,
                    ganoSemis: posicionFinal <= 2,
                    llegoFinal: posicionFinal <= 2,
                    ganoFinal: posicionFinal === 1
                });
            }
        });

        room.sendAnnouncement("──────────────────", null, 0xFFFFFF);
        room.sendAnnouncement("🏆 ¡FINAL DEL TORNEO!", null, 0xFFFF00, "bold");
        room.sendAnnouncement(`¡${winner.name} ES EL CAMPEÓN! 👑`, null, 0xFFFF00, "bold");
        room.sendAnnouncement(`Resultado final: 🔴 ${scores.red} - ${scores.blue} 🔵`, null, 0xFFFF00);
        room.sendAnnouncement("──────────────────", null, 0xFFFFFF);
        
        // Volver a modo normal
        isTournamentMode = false;
    }
};

    room.onGameStart = () => {
    // Debug y reseteo de banderas principales
    console.log("Debug - Partido iniciado, reseteando banderas");
    isGameEnding = false;
    hasAnnouncedOvertime = false;
    isProcessingResult = false;
    lastScores = null;
    
    // Reseteo de actividad AFK para todos los jugadores
    room.getPlayerList().forEach(player => resetPlayerActivity(player.id));
    
    // Anuncio de inicio
    room.sendAnnouncement("¡El partido ha comenzado! ⚽", null, 0x00FF00);
};

room.onGameTick = () => {
    if (isTournamentMode && room.getScores() != null) {
        const scores = room.getScores();
        const match = matchSchedule[currentMatch];

        // Verificar si es fase de grupos o eliminatorias
        if (match && (match.phase === 'SF' || match.phase === 'F')) {
            // Manejo de overtime para semifinales y final
            if (scores.time >= 60 && !hasAnnouncedOvertime) {
                if (scores.red === scores.blue) {
                    hasAnnouncedOvertime = true;
                    room.sendAnnouncement("⚽ ¡TIEMPO EXTRA - GOL DE ORO!", null, 0xFFFF00, "bold");
                    room.sendAnnouncement("El próximo gol decidirá el ganador.", null, 0xFFFF00);
                } else {
                    // Si hay un ganador al final del tiempo regular, terminar el partido
                    room.stopGame();
                }
            }
        } else {
            // Lógica para fase de grupos
            if (scores.time >= 59.9 && !isGameEnding && !isProcessingResult) {
                console.log("Debug - Terminando partido de fase de grupos:", {
                    time: scores.time,
                    currentMatch,
                    scores: `${scores.red} - ${scores.blue}`
                });
                
                isGameEnding = true;
                isProcessingResult = true;

                // Actualizar estadísticas del partido de grupos
                if (match.player1?.auth) {
                    statsManager.updateMatchStats(match.player1.auth, {
                        golesMarcados: scores.red,
                        golesRecibidos: scores.blue,
                        victoria: scores.red > scores.blue,
                        fase: 'grupos'
                    });
                }
                
                if (match.player2?.auth) {
                    statsManager.updateMatchStats(match.player2.auth, {
                        golesMarcados: scores.blue,
                        golesRecibidos: scores.red,
                        victoria: scores.blue > scores.red,
                        fase: 'grupos'
                    });
                }
                
                // Buscar los jugadores actuales en los grupos
                let currentPlayer1 = null;
                let currentPlayer2 = null;

                // Buscar en grupo A
                groupA.forEach(p => {
                    if (p.id === match.player1.id) currentPlayer1 = p;
                    if (p.id === match.player2.id) currentPlayer2 = p;
                });

                // Buscar en grupo B
                groupB.forEach(p => {
                    if (p.id === match.player1.id) currentPlayer1 = p;
                    if (p.id === match.player2.id) currentPlayer2 = p;
                });

                if (currentPlayer1 && currentPlayer2) {
                    // Actualizar estadísticas usando las referencias actualizadas
                    currentPlayer1.matchesPlayed++;
                    currentPlayer2.matchesPlayed++;
                    currentPlayer1.goalsFor += scores.red;
                    currentPlayer1.goalsAgainst += scores.blue;
                    currentPlayer2.goalsFor += scores.blue;
                    currentPlayer2.goalsAgainst += scores.red;

                    // Determinar resultado
                    if (scores.red > scores.blue) {
                        currentPlayer1.points += 3;
                        room.sendAnnouncement(`🏆 Victoria para ${currentPlayer1.name}!`, null, 0x00FF00, "bold");
                    } else if (scores.blue > scores.red) {
                        currentPlayer2.points += 3;
                        room.sendAnnouncement(`🏆 Victoria para ${currentPlayer2.name}!`, null, 0x00FF00, "bold");
                    } else {
                        // Empate
                        currentPlayer1.points += 1;
                        currentPlayer2.points += 1;
                        room.sendAnnouncement("🤝 ¡Empate!", null, 0xFFFF00, "bold");
                    }
                }

                room.sendAnnouncement(`Resultado final: 🔴 ${scores.red} - ${scores.blue} 🔵`, null, 0xFFFF00);

                // Parar el partido
                room.stopGame();

                console.log("Debug - Preparando siguiente partido:", {
                    currentMatch,
                    totalMatches: matchSchedule.length
                });

                // Preparar siguiente partido
                currentMatch++;
                if (currentMatch >= matchSchedule.length) {
                    console.log("Debug - Fase de grupos finalizada, iniciando semifinales");
                    room.sendAnnouncement("🎉 ¡Fase de grupos finalizada!", null, 0xFFFF00, "bold");
                    setTimeout(() => startSemifinals(), 5000);
                } else {
                    console.log("Debug - Preparando próximo partido de grupos:", {
                        nextMatch: currentMatch,
                        player1: matchSchedule[currentMatch].player1.name,
                        player2: matchSchedule[currentMatch].player2.name
                    });
                    
                    room.sendAnnouncement("⏳ Próximo partido en 10 segundos...", null, 0x00FF00);
                    
                    // Mover todos a espectador primero
                    room.getPlayerList().forEach(p => {
                        room.setPlayerTeam(p.id, teams.SPECTATOR);
                    });

                    // Esperar antes de iniciar el siguiente partido
                    setTimeout(() => {
                        console.log("Debug - Iniciando siguiente partido");
                        startTournamentMatch();
                    }, 10000);
                }

                // Resetear banderas
                setTimeout(() => {
                    isGameEnding = false;
                    isProcessingResult = false;
                    console.log("Debug - Banderas reseteadas:", {
                        isGameEnding,
                        isProcessingResult
                    });
                }, 1000);
            }
        }
    }
};

// Eventos para manejar pausas
room.onGamePause = (byPlayer) => {
    isGamePaused = true;
    room.getPlayerList().forEach(player => resetPlayerActivity(player.id));
};

room.onGameUnpause = (byPlayer) => {
    isGamePaused = false;
    room.getPlayerList().forEach(player => resetPlayerActivity(player.id));
};
room.onPlayerBallKick = (player) => {
    resetPlayerActivity(player.id);
};

room.onPlayerTeamChange = (player, byPlayer) => {
    resetPlayerActivity(player.id);
};
   
   // Evento para trackear toques
room.onPlayerBallKick = (player) => {
    lastPlayerTouch = player;
    resetPlayerActivity(player.id); // Mantener la funcionalidad AFK
};

// Iniciar el sistema anti-AFK
setInterval(checkAFKPlayers, 1000);

   // Mensaje de inicio
    console.log("✅ Servidor iniciado correctamente. Esperando enlace de la sala...");
});
