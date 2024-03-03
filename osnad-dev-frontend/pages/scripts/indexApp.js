

/* init datepicker */
$("#datepickerFrom").datepicker({});
$("#datepickerTo").datepicker({});

/*  Add keywordbox */
function addKeywordbox(text, field) {
  let inputKeywords = [
    '<div class="alert alert-primary alert-dismissible w-50" role="alert">',
    `<div class="curKeywords">${text}</div>`,
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div></div>",
  ].join("");
  $(field).append(inputKeywords);
}

/* Add warning box */
function addWarningbox(text, field) {
  let warning = `<div class="alert alert-danger alert-dismissible auto-fade" role="alert"><div>${text}</div></div>`; //set warning if more than 5 keywords
  $(field).append(warning);
  $(".auto-fade").fadeOut(1500); //auto fadeout
}

/* Current keywords string */
function curKeywordsStr() {
  let keywordsSets = [];
  $(".curKeywords").each(function () {
    let res = $(this).text();
    keywordsSets.push(res);
  });
  let keywords = keywordsSets.join(",");
  return keywords; //return string of current exist keywords
}

/* Current algorithm string */
function curAurl() {
  let aUrl = "";
  let sentinetUrl = "http://127.0.0.1:7776/search/?query=";
  let textBlobUrl = "http://127.0.0.1:7776/search/tb/?query=";
  let flairUrl = "http://127.0.0.1:7776/search/flair/?query=";
  if ($("#aSelect").val() === "sentinet") {
    aUrl = sentinetUrl;
  } else if ($("#aSelect").val() === "flair") {
    aUrl = flairUrl;
  } else {
    aUrl = textBlobUrl;
  }
  return aUrl;
}

/* Tweet list render */
function listRender(request) {
  $("#datatable").DataTable({
    ajax: {
      url: request,
      dataSrc: "",
      crossDomain: true,
      dataType: "json",
      headers: {
        "ngrok-skip-browser-warning": "",
        "Access-Control-Allow-Origin": "*",
      },
    },
    columns: [
      { data: "Tweet" },
      { data: "User" },
      {
        data: "sentiment",
        render: function (data, type) {
          //render different color for different sentiment
          if (type === "display") {
            let color = "blue";
            if (data === "positive") {
              color = "green";
            } else if (data === "negative") {
              color = "red";
            }
            return '<span style="color:' + color + '">' + data + "</span>";
          }
          return data;
        },
      },
    ],
    dom: "lfrtipB",
    buttons: [
      //csv files export
      {
        extend: "csv",
        text: "Export as CSV",
        exportOptions: {
          modifier: {
            search: "none",
          },
        },
      },
    ],
    bDestroy: true,
  });
}

/* Tweet list render with selection*/
function listRenderSelect(request, senti) {
  //render specific sentiment only
  $("#datatable").DataTable({
    ajax: {
      url: request,
      dataSrc: "",
      crossDomain: true,
      dataType: "json",
      headers: {
        "ngrok-skip-browser-warning": "",
        "Access-Control-Allow-Origin": "*",
      },
    },
    columns: [
      { data: "Tweet" },
      { data: "User" },
      {
        data: "sentiment",
        render: function (data, type) {
          if (type === "display") {
            let color = "blue";
            if (data === "positive") {
              color = "green";
            } else if (data === "negative") {
              color = "red";
            }
            if (data === senti)
              //sentiment selection for chart click action
              return '<span style="color:' + color + '">' + data + "</span>";
            else return "";
          }
          return data;
        },
      },
    ],
    dom: "lfrtipB",
    buttons: [
      {
        extend: "csv",
        text: "Export as CSV",
        exportOptions: {
          modifier: {
            search: "none",
          },
        },
      },
    ],
    bDestroy: true,
  });
}

/* charts render */
function chartRender(positiveD, negativeD, neutralD, allowClick, url) {
  let myChart = echarts.init(document.getElementById("charts"));
  let option = {
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} ({d}%)",
      extraCssText: "width:175px;height:50px;",
    },
    series: [
      {
        type: "pie",
        data: [
          {
            value: positiveD,
            name: "Positive",
            itemStyle: { color: "#198754" },
          },
          {
            value: negativeD,
            name: "Negative",
            itemStyle: { color: "#dc3545" },
          },
          { value: neutralD, name: "Neutral", itemStyle: { color: "#0d6efd" } },
        ],
        label: {
          position: "outside",
          show: true,
          formatter: "{b}",
          color: "#ffffff",
          fontSize: 12,
        },
      },
    ],
  };
  myChart.setOption(option);
  if (allowClick) {
    //for render specific sentiment
    myChart.on("click", function (params) {
      if (params.dataIndex === 0) {
        alert("Positive");
        listRenderSelect(url, "positive");
      } else if (params.dataIndex === 1) {
        alert("Negative");
        listRenderSelect(url, "negative");
      } else if (params.dataIndex === 2) {
        alert("Neutral");
        listRenderSelect(url, "neutral");
      }
    });
  }
}

/* chart render with AJAX */
function chartRenderAjax(request) {
  $.ajax({
    url: request,
    dataType: "json",
    type: "get",
    headers: {
      "ngrok-skip-browser-warning": "",
      "Access-Control-Allow-Origin": "*",
    },
    success: function (data) {
      let positiveCount = 0;
      let negativeCount = 0;
      let neutralCount = 0;
      $.each(data, function (i, item) {
        //count num from api source json
        switch (item["sentiment"]) {
          case "positive":
            positiveCount++;
            break;
          case "negative":
            negativeCount++;
            break;
          case "neutral":
            neutralCount++;
            break;
        }
      });
      chartRender(positiveCount, negativeCount, neutralCount, true, request);
    },
    error: function () {
      alert("fail to render chart!");
    },
  });
}

/* chart and list init */
chartRender(1, 2, 2, false); //chart initial with data 1, 2, 2, allowClick = false
$("#datatable").DataTable({
  //initial with local data in html file
  dom: "lfrtipB",
  buttons: [
    {
      extend: "csv",
      text: "Export as CSV",
      exportOptions: {
        modifier: {
          search: "none",
        },
      },
    },
  ],
});

/* Search limitation*/
$("#searchContent").attr("maxlength", 28);
let searchCount = 0;
$("#addButton").click(function () {
  searchCount = $("#keywords .alert-primary").length; //set count
  if (searchCount < 5) {
    //max 5 keywords
    let message = $("#searchContent").val();
    let keywordsArrey = []; //array of all current keywords
    $(".curKeywords").each(function () {
      let res = $(this).text();
      keywordsArrey.push(res);
    });
    if (message && keywordsArrey.indexOf(message) === -1) {
      //no repetition or blank input
      addKeywordbox(message, "#keywords");
    }
  } else {
    addWarningbox("Maximum 5 keywords!", "#overWarning");
  }
});

/* Date setting */
$("#dateApply").click(function () {
  let from = $("#datepickerFrom").datepicker("getDate"); //JS date object
  let to = $("#datepickerTo").datepicker("getDate");
  if (from > to) {
    //date constraint
    addWarningbox("Invaild date range!", "#dateWarning");
  }
  //alert(from.getFullYear().toString() + "/" + (from.getMonth() + 1).toString() + "/" + from.getDate().toString());
});

/* Search action */
$("#searchButton").click(function () {
  let keywords = curKeywordsStr();
  let aUrl = curAurl();
  if (keywords !== "") {
    listRender(aUrl + keywords);
    chartRenderAjax(aUrl + keywords);
  } else {
    alert("Please input keywords!");
  }
});

/* Algorithm apply action */
$("#chartSearch").click(function () {
  let keywords = curKeywordsStr();
  let aUrl = curAurl();
  if (keywords !== "") {
    listRender(aUrl + keywords);
    chartRenderAjax(aUrl + keywords);
  } else {
    alert("Please input keywords!");
  }
});
