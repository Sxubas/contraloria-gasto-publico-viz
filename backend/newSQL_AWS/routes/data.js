var express = require("express");
var router = express.Router();

const sqlite3 = require("sqlite3").verbose();
const json2csv = require("json2csv");

/* GET data listing. */
router.get("/", function(req, res, next) {
	// console.log("algo");

	let sc = req.query.sc;
	let q = req.query.q;
	let mun = req.query.mun;
	let d = req.query.d;
	let sql;

	console.log(sc, q, mun, d);

	if (d) {
		sql = `SELECT  NOM_ORIG, NOM_AMB, NOM_CHIP,NOM_DEST, NOM_FIN, value FROM OUTCOME WHERE NOM_MUN = "${d}"`;
	}
	if (mun) {
		sql = `SELECT t1.NOM_MUN, t1.NOM_CATEGORIA, t1.NOM_DEPAR, t1.[outcome], COALESCE(t2.[income], 0) AS [income] FROM (SELECT NOM_MUN, NOM_DEPAR, NOM_CATEGORIA, SUM(value) AS 'outcome' FROM outcome WHERE NOM_DEPAR = "${mun}" GROUP BY NOM_MUN) t1 LEFT JOIN (SELECT NOM_MUN, SUM(value) AS 'income' FROM income WHERE NOM_DEPAR = "${mun}"  GROUP BY NOM_MUN) t2 ON (t1.NOM_MUN = t2.NOM_MUN);`;
	}
	if (q) {
		sql = `select distinct NOM_DEPAR from outcome`;
	}
	if (sc) {
		sql = `select ${sc},count(nom_chip) as conteo from outcome group by ${sc}`;
	}
	if (!sc && !q && !mun && !d) {
		sql =
			// "select NOM_DEPAR,count(nom_chip) as conteo from outcome group by NOM_DEPAR;";
			"SELECT t1.NOM_MUN, t1.NOM_CATEGORIA, t1.NOM_DEPAR, t1.[outcome], COALESCE(t2.[income], 0) AS [income] FROM (SELECT NOM_MUN, NOM_DEPAR, NOM_CATEGORIA, SUM(value) AS 'outcome' FROM outcome GROUP BY NOM_MUN) t1 LEFT JOIN (SELECT NOM_MUN, SUM(value) AS 'income' FROM income GROUP BY NOM_MUN) t2 ON (t1.NOM_MUN = t2.NOM_MUN);";
	}

	let queryResult;

	let db = new sqlite3.Database("./public/db/main.db", err => {
		if (err) {
			return console.error(err.message);
		}
		console.log("Connected to the 'data/main.db' SQlite database.");
	});

	db.all(sql, [], (err, rows) => {
		console.log("sql", sql);
		if (err) {
			throw err;
		}
		res.set("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", 'attachment; filename="huehue.csv"');
		res.status(200).send(json2csv.parse(rows));
	});

	db.close(err => {
		if (err) {
			return console.error(err.message);
		}
		console.log("Close the database connection.");
	});
});

module.exports = router;
