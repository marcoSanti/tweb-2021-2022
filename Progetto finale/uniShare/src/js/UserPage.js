var oldX = null;
var oldY = null;
var moving = null;
var maxZ = 1000;
var lastPosition;

function toggleEditPageMenu(){
    var button = $("#ToggleEditUserPage");
    $("#SideMenuEditPage").toggle("slow");
    var state = button.html();
    if(state === 'Personalizza aspetto'){
        button.html('Salva modifiche');
    }else{
        button.html('Personalizza aspetto');
    }


}

function widgetMouseButtonDown(event) {
    $(this).css({"z-index" : ++maxZ, "position" : "absolute"}); // move clicked square to top
    moving = this;
    oldX = event.pageX;        // remember this square for
    oldY = event.pageY;

}

function widgetMouseButtonUp(event) {
    $("#"+event.target.id).css({"position" : "", "z-index":"", "top": "", "left":""});

    var elementToAdd = event.target.id;
    var replacementWidget = null;
    var replacementContainer = $("#" + lastPosition.attr('id') + " .ContentsContainerGrid");

    if(elementToAdd === "AddWidgetProfileInfo" && lastPosition){

        $("#WidgetEarnings").replaceWith($("#TemplateEmptyCard").clone()); //delete other widgets of same type to avoid problems with multiple equal id
        replacementWidget= $("#TemplateAccountWidget");
        replacementContainer.html(replacementWidget.clone().attr('id', 'WidgetAccountInfo'));


    }else if(elementToAdd === "AddWidgetEarnings" && lastPosition){

        $("#WidgetEarnings").replaceWith($("#TemplateEmptyCard").clone()); //delete other widgets of same type to avoid problems with multiple equal id
        replacementWidget = $("#TemplateWidgetEarnings");
        replacementContainer.html(replacementWidget.clone().attr('id', 'WidgetEarnings'));
        updateEarningsGraph();

    }else if(elementToAdd === "AddWidgetExpenses" && lastPosition){

        $("#WidgetExpenses").replaceWith($("#TemplateEmptyCard").clone()); //delete other widgets of same type to avoid problems with multiple equal id
        replacementWidget = $("#TemplateWidgetExpenses");
        replacementContainer.html(replacementWidget.clone().attr('id', 'WidgetExpenses'));
        updateExpensesGraph();

    }else if(elementToAdd === "AddWidgetPurchase" && lastPosition){
        $("#WidgetPurchase").replaceWith($("#TemplateEmptyCard").clone()); //delete other widgets of same type to avoid problems with multiple equal id
        replacementWidget = $("#TemplateWidgetPurchase");
        replacementContainer.html(replacementWidget.clone().attr('id', 'WidgetPurchase'));
    }


    $("#overlay1-2").fadeOut();
    $("#overlay2-1").fadeOut();
    $("#overlay2-2").fadeOut();
    $("#overlay1-1").fadeOut();
    moving = null;
}

function widgetAddMove(event) {

    if (this === moving && oldX !== null && oldY !== null) {

        var positionX = parseInt($(this).css("left")) + (event.pageX - oldX);
        var positionY = parseInt($(this).css("top"))  + (event.pageY - oldY);

        $(this).css({"left" : positionX + "px"});
        $(this).css({"top" : positionY + "px"});

        oldX = event.pageX;   // update old x/y to current position
        oldY = event.pageY;

        //check that i am not hovering onto one of the possible target of the grid
        var GridCell1 = $("#ContainerGrid1-1");
        var GridCell2 = $("#ContainerGrid1-2");
        var GridCell3 = $("#ContainerGrid2-1");
        var GridCell4 = $("#ContainerGrid2-2");

        if(
            positionX >= GridCell1.position().left &&
            positionX <= (GridCell1.position().left + GridCell1.width()) &&
            positionY >= GridCell1.position().top &&
            positionY <= (GridCell1.position().top + GridCell1.height())
        ){
            $("#overlay1-2").fadeOut();
            $("#overlay2-1").fadeOut();
            $("#overlay2-2").fadeOut();
            $("#overlay1-1").fadeIn();
            lastPosition=GridCell1;
        }else if(
            positionX >= GridCell2.position().left &&
            positionX <= (GridCell2.position().left + GridCell1.width()) &&
            positionY >= GridCell2.position().top &&
            positionY <= (GridCell2.position().top + GridCell1.height())
        ){
            $("#overlay1-2").fadeIn();
            $("#overlay2-1").fadeOut();
            $("#overlay2-2").fadeOut();
            $("#overlay1-1").fadeOut();
            lastPosition=GridCell2;
        }else if(
            positionX >= GridCell3.position().left &&
            positionX <= (GridCell3.position().left + GridCell1.width()) &&
            positionY >= GridCell3.position().top &&
            positionY <= (GridCell3.position().top + GridCell1.height())
        ){
            $("#overlay1-2").fadeOut();
            $("#overlay2-1").fadeIn();
            $("#overlay2-2").fadeOut();
            $("#overlay1-1").fadeOut();
            lastPosition=GridCell3;
        }else if(
            positionX >= GridCell4.position().left &&
            positionX <= (GridCell4.position().left + GridCell1.width()) &&
            positionY >= GridCell4.position().top &&
            positionY <= (GridCell4.position().top + GridCell1.height())
        ){
            $("#overlay1-2").fadeOut();
            $("#overlay2-1").fadeOut();
            $("#overlay2-2").fadeIn();
            $("#overlay1-1").fadeOut();
            lastPosition=GridCell4;
        }else{
            $("#overlay1-2").fadeOut();
            $("#overlay2-1").fadeOut();
            $("#overlay2-2").fadeOut();
            $("#overlay1-1").fadeOut();
            lastPosition=null;
        }

    }
}


function updateExpensesGraph(){
    var ExpensesChartCanvas = $("#Expenses_canvas");
    if(ExpensesChartCanvas){
        const data = {
            labels: ['Appunto1', 'Appunto2', 'Appunto3', 'Appunto4', 'Appunto5'],
            datasets: [
                {
                    label: 'Guadagni mensili',
                    data: [100,200,300,400,500],
                    backgroundColor: Object.values(['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba']),
                }
            ]
        };
        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        // position: 'right',
                        display: false
                    },
                    title: {
                        display: false,
                    },
                    responsive: true,
                }
            },
        };
        var ExpensesChart = new Chart(ExpensesChartCanvas, config);
    }
}

function updateEarningsGraph(){
    var EarningsChartCanvas = $("#Earnings_canvas");
    if(EarningsChartCanvas){
        const data = {
            labels: ['Appunto1', 'Appunto2', 'Appunto3', 'Appunto4', 'Appunto5'],
            datasets: [
                {
                    label: 'Guadagni mensili',
                    data: [100,200,300,400,500],
                    backgroundColor: Object.values(['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba']),
                }
            ]
        };
        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        // position: 'right',
                        display: false
                    },
                    title: {
                        display: false,
                    },
                    responsive: true,
                }
            },
        };
        var EarningChartCanvas = new Chart(EarningsChartCanvas, config);
    }
}


function ClearUserPageViewBlock(){
    $("#UserProfileViewBlock").fadeOut(10);
    $("#UserPurchaseViewBlock").fadeOut(10);
    $("#UserSellingsViewBlock").fadeOut(10);
    $("#WidgetViewBlock").fadeOut(10);
    $("#TabShowDashboard").removeClass("active");
    $("#TabShowUserPurchase").removeClass("active");
    $("#TabShowUserProfile").removeClass("active");
    $("#TabShowUserEarnings").removeClass("active");

}


$(function (){
    $("#ToggleEditUserPage").click(toggleEditPageMenu);
    $("#AddWidgetProfileInfo").on({
        mousedown: widgetMouseButtonDown,
        mouseup: widgetMouseButtonUp,
        mousemove: widgetAddMove,
    });
    $("#AddWidgetPurchase").on({
        mousedown: widgetMouseButtonDown,
        mouseup: widgetMouseButtonUp,
        mousemove: widgetAddMove,
    });
    $("#AddWidgetEarnings").on({
        mousedown: widgetMouseButtonDown,
        mouseup: widgetMouseButtonUp,
        mousemove: widgetAddMove,
    });
    $("#AddWidgetExpenses").on({
        mousedown: widgetMouseButtonDown,
        mouseup: widgetMouseButtonUp,
        mousemove: widgetAddMove,
    });

    $("#TabShowDashboard").click(function(){
        ClearUserPageViewBlock();
        $("#WidgetViewBlock").fadeIn(10);
        $("#TabShowDashboard").addClass("active");
    });

    $("#TabShowUserProfile").click(function(){
        ClearUserPageViewBlock();
        $("#UserProfileViewBlock").fadeIn(10);
        $("#TabShowUserProfile").addClass("active");
    });

    $("#TabShowUserPurchase").click(function(){
        ClearUserPageViewBlock();
        $("#UserPurchaseViewBlock").fadeIn(10);
        $("#TabShowUserPurchase").addClass("active");
    });

    $("#TabShowUserEarnings").click(function(){
        ClearUserPageViewBlock();
        $("#UserSellingsViewBlock").fadeIn(10);
        $("#TabShowUserEarnings").addClass("active");
    });


});