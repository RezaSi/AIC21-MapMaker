var colors = ["rgb(127, 140, 141)", "rgb(192, 57, 43)", "rgb(39, 174, 96)", "rgb(241, 196, 15)", "rgb(52, 73, 94)"];

templateEmptyCell = (row, col, rec1, rec2) => `{"row": ${row}, "col": ${col}, "cell_type": 2, "rec1": ${rec1}, "rec2": ${rec2}},`;
templateWallCell = (row, col, rec1, rec2) => `{"row": ${row}, "col": ${col}, "cell_type": 3, "rec1": ${rec1}, "rec2": ${rec2}},`;
templateRec1Cell = (row, col, rec1, rec2) => `{"row": ${row}, "col": ${col}, "cell_type": 2, "rec1": ${rec1}, "rec2": ${rec2}},`;
templateRec2Cell = (row, col, rec1, rec2) => `{"row": ${row}, "col": ${col}, "cell_type": 2, "rec1": ${rec1}, "rec2": ${rec2}},`;
templateBaseCell = (row, col, rec1, rec2) => `{"row": ${row}, "col": ${col}, "cell_type": 1, "rec1": ${rec1}, "rec2": ${rec2}},`;

var color_to_object = {
    'rgb(127, 140, 141)': templateEmptyCell,
    'rgb(192, 57, 43)': templateWallCell,
    'rgb(39, 174, 96)': templateRec1Cell,
    'rgb(241, 196, 15)': templateRec2Cell,
    'rgb(52, 73, 94)': templateBaseCell
};

$(document).ready(function(){
    $(".table").on('mousedown', '.cell', event => {
        const clickedCell = $(event.target);
        switch(event.which) {
            case 1:
                backgroundColor = clickedCell.css("background-color");
                for(var i = 0; i < colors.length; ++i){
                    if(backgroundColor == colors[i]){
                        backgroundColor = colors[(i + 1) % colors.length];
                        break;
                    }
                }
            break;
            case 3:
                event.preventDefault();
                backgroundColor = "rgb(127, 140, 141)";
            break;
        }
        if(backgroundColor == "rgb(39, 174, 96)" || backgroundColor == "rgb(241, 196, 15)"){
            clickedCell.empty();
            if(clickedCell.append("<p>0</p>"));
        }else{
            clickedCell.empty();
        }
        clickedCell.css("background-color", backgroundColor);
    });
});

$(document).ready(function(){
    $(".table").on('mousewheel', '.cell', event => {
        event.preventDefault();
        const clickedCell = $(event.target);
        if(event.originalEvent.wheelDelta / 120 > 0) {
            clickedCell.find("p").text(parseInt(clickedCell.text()) + 1);
        }
        else{
            clickedCell.find("p").text(parseInt(clickedCell.text()) - 1);
        }
    });
});

$(document).ready(function(){
    $("#width").on('input', event => {
        width = $(event.target).val();
        $(".row").empty();
        for (var i = 0; i < width; ++i) {
            $(".row").append('<div class="cell"></div>');
        }
        
    });
});

$(document).ready(function(){
    $("#height").on('input', event => {
        height = $(event.target).val();
        $(".table").empty();
        for (var i = 0; i < height; ++i) {
            $(".table").append('<div class="row"></div>');
        }

        width = $("#width").val();
        $(".row").empty();
        for (var i = 0; i < width; ++i) {
            $(".row").append('<div class="cell"></div>');
        }
    });
});

$(document).ready(function(){
    $("#generate").on('click', event => {
        width = $("#width").val();
        height = $("#height").val();
        output = "";

        output += "{";
        output += "\n";
        output += '"MAP_HEIGHT": ' + height + ',' + "\n";
        output += '"MAP_WIDTH": ' + width + ',' + "\n";
        output += '"cells_type": [' + "\n";
        $( ".row" ).each(function( row ) {
            $(this).find( ".cell" ).each(function( col ) {
                value = parseInt($(this).find("p").text());
                backgroundColor = $( this ).css("background-color" );

                rec1 = 0;
                rec2 = 0;
                if(backgroundColor == "rgb(39, 174, 96)"){
                    rec1 = value;
                }else if(backgroundColor == "rgb(241, 196, 15)"){
                    rec2 = value;
                }
                output += color_to_object[$( this ).css("background-color" )](row, col, rec1, rec2);
                output += "\n";
            });
        });
        output += (']' + "\n" + "}");
        $("#output").val(output);
    });
});

$(document).ready(function(){
    $("#load").on('click', event => {
        mapData = $("#output").val();
        mapData = mapData.replace(",\n]", "\n]");
        mapJson = JSON.parse(mapData);
        height = mapJson.MAP_HEIGHT
        width = mapJson.MAP_WIDTH;

        $("#height").val(height);
        $("#width").val(width);

        $(".table").empty();
        for (var i = 0; i < height; ++i) {
            $(".table").append('<div class="row"></div>');
        }
        $(".row").empty();
        for (var i = 0; i < width; ++i) {
            $(".row").append('<div class="cell"></div>');
        }

        $( ".row" ).each(function( row ) {
            $(this).find( ".cell" ).each(function( col ) {
                for(var i = 0; i < height * width; ++i){
                    if(mapJson.cells_type[i].row == row && mapJson.cells_type[i].col == col){
                        if(mapJson.cells_type[i].cell_type == 3){
                            $( this ).css("background-color", "rgb(192, 57, 43)");
                        }
                        if(mapJson.cells_type[i].cell_type == 1 || mapJson.cells_type[i].cell_type == 0){
                            $( this ).css("background-color", "rgb(52, 73, 94)");
                        }
                        if(mapJson.cells_type[i].cell_type == 2){
                            if(mapJson.cells_type[i].rec1 > 0){
                                $( this ).css("background-color", "rgb(39, 174, 96)");
                                $( this ).append("<p>" + mapJson.cells_type[i].rec1 + "</p>");
                            }else if(mapJson.cells_type[i].rec2 > 0){
                                $( this ).css("background-color", "rgb(241, 196, 15)");
                                $( this ).append("<p>" + mapJson.cells_type[i].rec2 + "</p>");
                            }
                        }
                    }
                }
            });
        });
    });
});


$(function() {
    $(this).bind("contextmenu", function(e) {
        e.preventDefault();
    });
});
