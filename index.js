let loads = [24];
let a = [24];

class Gen {
  constructor(num, min, max, a, b, c, f) {
    this.number = num;
    this.p_min = min;
    this.p_max = max;
    this.A = a;
    this.B = b;
    this.C = c;
    this.cost = f;
    this.heat = this.A * this.p_max ** 2 + this.B * this.p_max + this.C;
    this.flapc = (this.cost * this.heat) / this.p_max;
  }
}

class Gens {
  constructor() {
    this.gens = [];
    this.max_limit = 0;
    this.min_limit = 0;
  }
  // create a new generator and save it in the collection
  newGenerator(num, min, max, a, b, c, f) {
    let g = new Gen(num, min, max, a, b, c, f);
    this.gens.push(g);
    return g;
  }

  get return_list() {
    return this.gens;
  }
  get limits() {
    for (const gen of this.gens) {
      this.max_limit += gen.p_max;
      this.min_limit += gen.p_min;
    }
    return this.min_limit, this.max_limit;
  }

  low() {
    for (const gen of this.gens) {
      this.min_limit += gen.p_min;
    }
    return this.min_limit;
  }

  high() {
    for (const gen of this.gens) {
      this.max_limit += gen.p_max;
    }
    return this.max_limit;
  }
}

//this function will give the random values between max and min
function randomize() {
  max = 1799;
  min = 200;
  for (i = 0; i < 24; i++) {
    a[i] = Math.floor(Math.random() * (max - min) + min);
  }
  for (i = 0; i < 24; i++) {
    document.getElementById(i + 1).setAttribute("value", a[i]);
  }
}

const excel_file = document.getElementById("excel_file");

document.getElementById("submit").onclick = function () {
  //first we'll make the graph

  JSC.chart("chartDiv", {
    type: "line",
    defaultPoint_marker_type: "circle",
    series: [
      {
        points: [
          { x: "1", y: parseInt(document.getElementById("1").value) },
          { x: "2", y: parseInt(document.getElementById("2").value) },
          { x: "3", y: parseInt(document.getElementById("3").value) },
          { x: "4", y: parseInt(document.getElementById("4").value) },
          { x: "5", y: parseInt(document.getElementById("5").value) },
          { x: "6", y: parseInt(document.getElementById("6").value) },
          { x: "7", y: parseInt(document.getElementById("7").value) },
          { x: "8", y: parseInt(document.getElementById("8").value) },
          { x: "9", y: parseInt(document.getElementById("9").value) },
          { x: "10", y: parseInt(document.getElementById("10").value) },
          { x: "11", y: parseInt(document.getElementById("11").value) },
          { x: "12", y: parseInt(document.getElementById("12").value) },
          { x: "13", y: parseInt(document.getElementById("13").value) },
          { x: "14", y: parseInt(document.getElementById("14").value) },
          { x: "15", y: parseInt(document.getElementById("15").value) },
          { x: "16", y: parseInt(document.getElementById("16").value) },
          { x: "17", y: parseInt(document.getElementById("17").value) },
          { x: "18", y: parseInt(document.getElementById("18").value) },
          { x: "19", y: parseInt(document.getElementById("19").value) },
          { x: "20", y: parseInt(document.getElementById("20").value) },
          { x: "21", y: parseInt(document.getElementById("21").value) },
          { x: "22", y: parseInt(document.getElementById("22").value) },
          { x: "23", y: parseInt(document.getElementById("23").value) },
          { x: "24", y: parseInt(document.getElementById("24").value) },
        ],
      },
    ],
    legend_visible: false,
  });

  //here we are getting the values for the priority table
  for (i = 0; i < 24; i++) {
    loads[i] = parseInt(document.getElementById(i + 1).value);
  }

  const arr = [
    { Unit: 1, min: 100, max: 400, A: 0.006, B: 7, C: 600, fuel: 1.1 },
    { Unit: 2, min: 50, max: 300, A: 0.01, B: 8, C: 400, fuel: 1.2 },
    { Unit: 3, min: 150, max: 500, A: 0.008, B: 6, C: 500, fuel: 1 },
    { Unit: 4, min: 200, max: 600, A: 0.007, B: 7, C: 450, fuel: 1 },
  ];

  let l = new Gens();

  // load generator limits from sheet

  for (const gen of arr) {
    const num = gen["Unit"];
    const min = gen["min"];
    const max = gen["max"];
    const A = gen["A"];
    const B = gen["B"];
    const C = gen["C"];
    const fuel = gen["fuel"];

    l.newGenerator(num, min, max, A, B, C, fuel);
  }

  // time to sort this list

  q = l.return_list;

  function compare_cost(a, b) {
    return a.flapc - b.flapc;
  }

  q.sort(compare_cost);

  //here we'll make the table
  let ii = 0;
  for (const gener of q) {
    var table = document.getElementById("tbl_id");
    var row = table.insertRow();

    var sno = row.insertCell(0);
    var unit = row.insertCell(1);
    var flapc = row.insertCell(2);
    var pmin = row.insertCell(3);
    var pmax = row.insertCell(4);
    ii++;
    sno.innerHTML = ii;

    unit.innerHTML = gener.number;
    flapc.innerHTML = gener.flapc;
    pmin.innerHTML = gener.p_min;
    pmax.innerHTML = gener.p_max;
  }

  let lower = l.low();
  let upper = l.high();

  for (let j = 0; j < loads.length; j++) {
    let s = [];
    let value = loads[j];

   
      let current = 0;
      while (value != 0) {

        var M = q[current].p_max;
        if (value <= M) {
          var term = value;
        } else if (value > M) {
          var term = M;
        }
        s.push([q[current].number, term]);
        current += 1;
        value -= M;
        value = Math.max(value, 0);
      }

      while (s.length < q.length) {
        s.push([q[current].number, 0]);
        current += 1;
      }
      console.log(s);

    

    var table = document.getElementById("generatorT_id");
    var row = table.insertRow();

    var loadValue = row.insertCell(0);
    loadValue.innerHTML = loads[j];

    var gen1 = row.insertCell(1);
    var gen2 = row.insertCell(2);
    var gen3 = row.insertCell(3);
    var gen4 = row.insertCell(4);

    gen1.innerHTML = s[2][1];
    gen2.innerHTML = s[3][1];
    gen3.innerHTML = s[0][1];
    gen4.innerHTML = s[1][1];


  }


};
