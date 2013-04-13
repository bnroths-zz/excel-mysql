var final_array = [];
var final_array_t = [];
var final_len = [];
var final_rows = "";
var final_columns = "";



function initEdit() {
    $("td").dblclick(function () {
        var row = $(this).data("row");
        var column = $(this).data("column");
        var value = $(this).text();
        console.log(row + " " + column + " " + value);
        $("#edit").data("row", row);
        $("#edit").data("column", column);
        $("#edit").val(value);

        $("#save").click(function () {

            var row = $("#edit").data("row");
            var column = $("#edit").data("column");
            var value = $("#edit").val();

            console.log(row);
            $("[data-row='" + row + "'][data-column='" + column + "']").text(value);

        });


    });
}
$("#submit").click(function () {
	alert("hi");
    $("#two, #three").html("");

    var array = ($("#input").val()).split(/\n/g);
    var length = array.length;

    // create multi-dimensional array from table
    for (var i = 0; i < length; i++) {
        final_array.push(array[i].split(/\t/g));
    }
    //console.log(final_array);



    // create table	
    var html = "<table>";
    final_rows = final_array.length;
    final_columns = final_array[0].length;


    for (var k = 0; k < final_rows; k++) {

        html += "<tr>";

        for (var j = 0; j < final_columns; j++) {

            if (k == 0) {

                html += "<td class=" + type(final_array[k][j]) + " data-row=" + k + "  data-column=" + j + " data-type=" + type(final_array[k][j]) + ">" + final_array[k][j].replace(" ", "_").replace(/'/g, "\\'") + "</td>";
            } else {
                html += "<td class=" + type(final_array[k][j]) + " data-row=" + k + "  data-column=" + j + " data-type=" + type(final_array[k][j]) + ">" + final_array[k][j].replace(/'/g, "\\'") + "</td>";

            }



        }
        html += "</tr>";
    }

    html += "</table>";


    $("#two").html(html).fadeIn();
    $("#one").fadeOut();

    final_array_t = transpose(final_array);
    maxLength(final_array_t);
    createTableText(final_array);
    setColumnWidth();

    $("#back").fadeIn();

    initEdit();

});

$("#back").click(function () {
    $("#two, #three").fadeOut();
    $("#one").fadeIn();
    $("#back").fadeOut();
    final_array = [];
    final_array_t = [];
    final_len = [];
    final_rows = "";
    final_columns = "";


});

function createTableText(final_array) {
    var query = "";
    query += "-- create table<br>CREATE TABLE table_name (<br>";

    var columns = "";
    //console.log(final_len);
    query += "<div class='tab'>";
    for (var j = 0; j < final_array[0].length; j++) {
        columns += final_array[0][j].replace(" ", "_").replace(/'/g, "\\'") + " VARCHAR(" + final_len[j] + "), <br>";
    }
    //console.log(columns);
    columns = columns.substring(0, columns.length - 6);
    //console.log(columns);
    query += columns + "<br>);</div>"

    // insert values
    query += "<br>-- insert values<br><div class='insert'>";
    query += "INSERT INTO table_name<br>";
    query += "<div class='tab'>(";

    var values = "";
    for (var j = 0; j < final_columns; j++) {
        values += final_array[0][j] + ",";
    }
    //console.log(values);
    values = values.substring(0, values.length - 1);
    //console.log(values);
    query += values + ")</div>VALUES<br><div class='tab'>";

    var values = "";
    for (var k = 1; k < final_rows; k++) {
        values += "(";

        // skip first row which is header
        for (var j = 0; j < final_columns; j++) {
            values += "'" + final_array[k][j].replace(/'/g, "\\'") + "',";
        }
        values = values.substring(0, values.length - 1);
        values += "),<br>"
    }
    //console.log(values);
    values = values.substring(0, values.length - 5);
    values += ";";
    //console.log(values);

    query += values + "<br></div></div>";
    $("#three").html(query).fadeIn();
}


function maxLength(array) {
    for (var j = 0; j < final_columns; j++) {

        final_len.push(Math.max.apply(Math, $.map(array[j], function (el) {
            return el.length
        })));

    }
}


function type(str) {

    if ($.isNumeric(str)) {
        return "number";
    } else {
        return $.type(str)
    }



}


function transpose(a) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) {
            return r[c];
        });
    });
}



function setColumnWidth() {
    var total = $.sum(final_len);

    for (var j = 0; j < final_columns; j++) {

        // should change this to average length
        var percent = parseInt(100 * final_len[j] / total);
        //console.log(percent);
        $("td").eq(j).css("width", percent + "%");

    }

}
$.sum = function (arr) {
    var r = 0;
    $.each(arr, function (i, v) {
        r += v;
    });
    return r;
}

