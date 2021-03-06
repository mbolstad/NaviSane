// ==UserScript==
// @name        NaviSane
// @version     1.2
// @namespace   https://github.com/jlous/NaviSane
// @homepage    https://github.com/jlous/NaviSane
// @downloadURL https://github.com/jlous/NaviSane/raw/master/NaviSane.tamper.js
// @copyright   2013, Joachim Lous
// @description GUI-tweaks for timeføring
// @match       https://naviwep.steria.no/NaviWEB/timereg_direct.aspx
// @require     http://code.jquery.com/jquery-1.10.1.min.js
// ==/UserScript==

function saneColumnHeaders(){
    monthName = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $("a[title^='Date']" ).each(function(){
        title = $(this).attr("title");
        month = Number(title.substr(10, 2));
        day = Number(title.substr(12, 2));
        date = monthName[month] + " " + day;
        $(this).append("<br\>"+date);
    });
}

function saneCellAlignment(){
    $('span.riSingle').css('width','auto');
}

function currentPeriod(){
    header = $("#ctl00_ContentPlaceHolder1_LBL_CurrentPeriod").text();
    return header.replace(/^.*(\d\d\.\d\d\.\d\d\d\d - \d\d\.\d\d\.\d\d\d\d).*$/, "$1");
}

function sanePeriodNavigation(){
    $(".CurrentPeriod").prepend("<button type='button' id='prevPeriod'>◀</button>");
    $(".CurrentPeriod").append("<button type='button' id='nextPeriod'>▶</button>");
    
    $("#prevPeriod").click(function() {
        period = currentPeriod();
        dropdown = $("#ctl00_ContentPlaceHolder1_PeriodDropdownList_Arrow").get(0);
        dropdown.click();
        thisItem = $("li.rcbItem:contains('"+period+"')");
        thisItem.next().click();
    } );
    
    $("#nextPeriod").click(function() {
        period = currentPeriod();
        dropdown = $("#ctl00_ContentPlaceHolder1_PeriodDropdownList_Arrow").get(0);
        dropdown.click();
        thisItem = $("li.rcbItem:contains('"+period+"')");
        thisItem.prev().click();
    } );
}

function sanePeriodHeader(){
    headerSpan = $("#ctl00_ContentPlaceHolder1_LBL_CurrentPeriod");
    oldTitle = headerSpan.text();
    groups = /^(\d\d\.\d\d\.\d\d\d\d - \d\d\.\d\d\.\d\d\d\d) .Week(\d\d?).\d\d\d\d ?(\d?)/.exec(oldTitle);
    dateRange = groups[1];
    weekNo = groups[2];
    weekPart = groups[3];
    weekSep = weekPart.length>0 ? "." : ""; 
    newText = "<b>Week " + weekNo + weekSep + weekPart + "</b> &nbsp; <span style='color:silver;font-size:smaller'>" + dateRange + "</span>";
    headerSpan.html(newText);
}

function initPeriod(){
    saneColumnHeaders();
    saneCellAlignment();
    sanePeriodHeader();

    // TODO:
    // zebraStripes();
    // likeYesterdayShortcut();
    // saneTabbingOrder();
    // saneArrowKeys()
}

function initPage(){
    sanePeriodNavigation();
    $(".CurrentPeriod").on("DOMNodeInserted", function(e){
        if (e.target.id == "ctl00_ContentPlaceHolder1_LBL_Approved"){
        	initPeriod();
        }
    });
}

initPage();
initPeriod();
