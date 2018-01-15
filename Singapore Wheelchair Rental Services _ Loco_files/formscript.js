jQuery("#startdate").datepicker({dateFormat: 'yy-mm-dd',minDate: new Date()});
jQuery("#enddate").datepicker({dateFormat: 'yy-mm-dd',minDate: new Date()});

var publicHolidayArray = [new Date(2017,07,09),new Date(2017,08,01),new Date(2017,09,18),new Date(2017,11,25),new Date(2018,0,1),new Date(2018,1,16),new Date(2018,1,17),new Date(2018,2,30),new Date(2018,4,1),new Date(2018,4,29),new Date(2018,5,15),new Date(2018,0,1),new Date(2018,7,9),new Date(2018,7,22),new Date(2018,10,6),new Date(2018,11,25)]

jQuery("#wpcf7-f5-o1").on("change", ":input", function() {

var theForm = document.forms["wpcf7-f5-o1"];
var numwheelchair= document.getElementById("numwheelchair").value;
var startdate= document.getElementById("startdate").value;
var enddate= document.getElementById("enddate").value;
var deliverytime = document.getElementById("deliverytime").value;
var collectiontime = document.getElementById("collectiontime").value;

var yr1   = parseInt(startdate.substring(0,4));
var mon1  = parseInt(startdate.substring(5,7));
var dt1   = parseInt(startdate.substring(8,10));
var date1 = new Date(yr1, mon1-1, dt1);

var yr2   = parseInt(enddate.substring(0,4));
var mon2  = parseInt(enddate.substring(5,7));
var dt2   = parseInt(enddate.substring(8,10));
var date2 = new Date(yr2, mon2-1, dt2);

var t2 = date2.getTime();
var t1 = date1.getTime();

//Difference between start and end date
var numdays=0;
numdays = parseInt((t2-t1)/(24*3600*1000));

var today = new Date();

//Difference between today and start date
var todaystartdiff=0;
var t1temp = new Date(t1).setHours(0, 0, 0, 0);
var todaytemp = new Date(today).setHours(0, 0, 0, 0);
todaystartdiff = parseInt((t1temp-todaytemp)/(24*3600*1000));

var rateday=10;
var rateweek=40;
var ratemonth=100;
var delivery=33.5;
var deposit=70;
var totalamount = 0;
var deliveryto=17.5;
var deliverycollect=16;

if(numwheelchair<0){
	numwheelchair= 0;
}

var hournow = today.toLocaleString('en-US', {hour: '2-digit', hour12: false, timeZone: 'Asia/Singapore'});

var dateCheck1 = new Date(today).setHours(0, 0, 0, 0);
var dateCheck2 = new Date(date1).setHours(0, 0, 0, 0);

//Remove 9amto1pm option if delivery date is same as today 
//OR if delivery date is tmr and today is after 3pm
//OR if delivery date is monday and right now is sat after 12pm
if( (dateCheck1==dateCheck2) || (todaystartdiff==1 && hournow >=15)){
	jQuery("#deliverytime option[value='9am to 1pm']").remove();
}else if(today.getDay()==6 && date1.getDay()==1 && deliverytime==="9am to 1pm" && hournow >=12){
	jQuery("#deliverytime option[value='9am to 1pm']").remove();
}else if(jQuery("#deliverytime option[value='9am to 1pm']").length==0){
		jQuery("#deliverytime").prepend('<option value="9am to 1pm">9am to 1pm</option>');
}

//Check if after friday 3pm order, start date is on weekend
if((today.getDay()==5 && hournow >= 15 && todaystartdiff<=2) || (today.getDay()==6 && todaystartdiff<=1) || (today.getDay()==6 && todaystartdiff<=0) ){ 
	document.getElementById("submitbutton").style.visibility = 'hidden';
	document.getElementById("locoerrormsg").innerHTML = "<font color='red'><b>The order deadline for weekend delivery has passed (Friday 3pm), the next earliest delivery date will be on Monday. Please select an alternative start date.</b></font><br/>";	
} //Check if same day 10am rental
else if(dateCheck1==dateCheck2 && hournow >= 10){
	document.getElementById("submitbutton").style.visibility = 'hidden';
	document.getElementById("locoerrormsg").innerHTML = "<font color='red'><b>The order deadline for same-day delivery has passed (10am), the earliest delivery date will be the next day. Please select an alternative start date.</b></font><br/>";	
} else {
	document.getElementById("submitbutton").style.visibility = 'visible';
	document.getElementById("locoerrormsg").innerHTML = "";	
}

//Check if end date earlier than start date
if(Date.parse(date2) < Date.parse(date1)){
	document.getElementById("submitbutton").style.visibility = 'hidden';
	document.getElementById("locoerrormsg").innerHTML = "<font color='red'><b>Please select an End Date later than your Start Date</b></font><br/>";	
}


//Delivery and collection pricing for sat/sun/ph
if( (date1.getDay()==6 || date1.getDay()==0) || isPublicHoliday(date1)){
	deliveryto=34;
//Delivery for weekdays	
} else{
	deliveryto=17.5;
}

//Delivery and collection pricing for sat/sun/ph
if( (date2.getDay()==6 || date2.getDay()==0) || isPublicHoliday(date2)){	
	deliverycollect=32.5;	
//Delivery for weekdays		
} else{
	deliverycollect=16;
}
delivery=deliveryto+deliverycollect;
if(numwheelchair>=2){
	delivery=delivery+5*(numwheelchair-2); 
}

//Main Form Code
if(numdays<=1){
	totalamount=10;
}else if(numdays<=30){
	totalamount = subtotalRateWeeks(numdays);
}else if(numdays>30){
	numMonths=Math.floor(numdays/30);
	daysleft=numdays%30;
	totalamount = numMonths*ratemonth + subtotalRateWeeks(daysleft);
}

var rentalsubtotal = totalamount*numwheelchair;
document.getElementById("paymentcalculation").innerHTML = "Rental: $" + rentalsubtotal 
								+ "<br/>Delivery: $" + delivery 
								+ "<br/>Deposit*: $" + deposit*numwheelchair;

document.getElementById("paymenttotal").innerHTML = "Total: $" + (rentalsubtotal+delivery+deposit*numwheelchair);
document.getElementById("depositrefundable").innerHTML = "<br/>\*Deposit will be refunded in full upon return of wheelchair(s)";

document.getElementById("hiddenrentalsubtotal").value = rentalsubtotal;
document.getElementById("hiddendeliverysubtotal").value = delivery;
document.getElementById("hiddendepositsubtotal").value = deposit*numwheelchair;
document.getElementById("hiddenpayment").value = rentalsubtotal+delivery+deposit*numwheelchair;
document.getElementById("daysofrental").value = numdays;
document.getElementById("orderid").value = "HJ85" + getRandomInt(3100, 9999) + randomString(1, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');

});

function subtotalRateDays(numdays){
	if(numdays<0){
		return 0;
	}
	else if(numdays<4){
		return 10*numdays;
	} else if(numdays>=4 && numdays<=7){
		return 40;
	} else {
		return 0;
	}
}

function subtotalRateWeeks(numdays){
	if(numdays<=7){
		return subtotalRateDays(numdays);
	}else if(numdays>7 && numdays<=14){
		return 40+subtotalRateDays(numdays-7);
	}else if(numdays==15){
		return 40*2 + 10;
	}else if(numdays>=16 && numdays<=30){
		return 100;
	}
}

//Check if public holiday
function isPublicHoliday(enteredDate){
	var dateCheck3 = new Date(enteredDate).setHours(0, 0, 0, 0);
	for(i=0; i<publicHolidayArray.length; i++){
		var dateCheck4 = new Date(publicHolidayArray[i]).setHours(0, 0, 0, 0);	
		if(dateCheck3==dateCheck4){
			return true;
		}		
	}
	return false;
}

//Generate random number
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Generate random characters and numbers
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}