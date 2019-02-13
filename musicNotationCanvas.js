//------------------------------------------------------------------------------
// musicNotationCanvas.js
//
//------------------------------------------------------------------------------
// assumes there is a canvas element with the id matching the canvas_id param
// if no param the default id is 'myCanvas' <canvas id='myCanvas'> is assumed on the page
//

function MusicNotation(canvas_id) {

var canvasID = canvas_id? canvas_id : 'myCanvas';
var canvas = document.getElementById(canvasID);
var ctx = canvas.getContext("2d");

// line5 value determines the vertical location of the staff
var line5 = 40; 
var staffLocation = line5+32;
var lineSpaceScale = 4.5;
var space4 = line5 + lineSpaceScale;
var line4 = space4 + lineSpaceScale;
var space3 = line4 + lineSpaceScale;
var line3 = space3 + lineSpaceScale;
var space2 = line3 + lineSpaceScale;
var line2 = space2 + lineSpaceScale;
var space1 = line2 + lineSpaceScale;
var line1 = space1 + lineSpaceScale;
var spaceBelowStaff = line1 + lineSpaceScale;
var ledgerBelow1 = spaceBelowStaff + lineSpaceScale;
var spaceBelowLedger1 = ledgerBelow1 + lineSpaceScale;
var ledgerBelow2 = spaceBelowLedger1 + lineSpaceScale;
var spaceBelowLedger2 = ledgerBelow2 + lineSpaceScale;
var ledgerBelow3 = spaceBelowLedger2 + lineSpaceScale;
var spaceBelowLedger3 = ledgerBelow3 + lineSpaceScale;

var spaceAboveStaff = line5 - lineSpaceScale;
var ledgerAbove1 = spaceAboveStaff - lineSpaceScale;
var spaceAboveLedger1 = ledgerAbove1 - lineSpaceScale;
var ledgerAbove2 = spaceAboveLedger1 - lineSpaceScale;
var spaceAboveLedger2 = ledgerAbove2 - lineSpaceScale;
var ledgerAbove3 = spaceAboveLedger2 - lineSpaceScale;


var ledgerLineXOffset = 2;
var ledgerLineYOffset = 3;
var accidentalXOffset = 12;
var accidentalYOffset = 4;

var noteSpacing = 50; // default, use Notation.setNoteSpacing(space) to change

var myClefFont = "54px MusicSync";
//var my24Font = "24px MusicSync";

var my36Font = "36px Maestro";
var my24Font = "24px Maestro";

var lastAnimatedNote; // so you can turn it back to normal as you animate another note

var TrebleStaffMap = {  
    "Ebb3" : spaceBelowLedger3, "Eb3" : spaceBelowLedger3, "E3" : spaceBelowLedger3, "E#3" : spaceBelowLedger3, "Ex3" : spaceBelowLedger3, 
    "Fbb3" : ledgerBelow3, "Fb3" : ledgerBelow3, "F3" : ledgerBelow3, "F#3" : ledgerBelow3, "Fx3" : ledgerBelow3, 
    "Gbb3" : spaceBelowLedger2, "Gb3" : spaceBelowLedger2, "G3" : spaceBelowLedger2, "G#3" : spaceBelowLedger2, "Gx3" : spaceBelowLedger2, 
    "Abb3" : ledgerBelow2, "Ab3" : ledgerBelow2, "A3" : ledgerBelow2, "A#3" : ledgerBelow2, "Ax3" : ledgerBelow2,
    "Bbb3" : spaceBelowLedger1, "Bb3" : spaceBelowLedger1, "B3" : spaceBelowLedger1, "B#3" : spaceBelowLedger1, "Bx3" : spaceBelowLedger1,
    "Cbb4" : ledgerBelow1, "Cb4" : ledgerBelow1, "C4" : ledgerBelow1, "C#4" : ledgerBelow1, "Cx4" : ledgerBelow1,
    "Dbb4" : spaceBelowStaff, "Db4" : spaceBelowStaff, "D4" : spaceBelowStaff, "D#4" : spaceBelowStaff, "Dx4" : spaceBelowStaff, 
    "Ebb4" : line1, "Eb4" : line1, "E4" : line1, "E#4" : line1, "Ex4" : line1, 
    "Fbb4" : space1, "Fb4" : space1, "F4" : space1, "F#4" : space1, "Fx4" : space1, 
    "Gbb4" : line2, "Gb4" : line2, "G4" : line2, "G#4" : line2, "Gx4" : line2, 
    "Abb4" : space2, "Ab4" : space2, "A4" : space2, "A#4" : space2, "Ax4" : space2, 
    "Bbb4" : line3, "Bb4" : line3, "B4" : line3, "B#4" : line3, "Bx4" : line3, 
    "Cbb5" : space3, "Cb5" : space3, "C5" : space3, "C#5" : space3, "Cx5" : space3, 
    "Dbb5" : line4, "Db5" : line4, "D5" : line4, "D#5" : line4, "Dx5" : line4, 
    "Ebb5" : space4, "Eb5" : space4, "E5" : space4, "E#5" : space4, "Ex5" : space4, 
    "Fbb5" : line5, "Fb5" : line5, "F5" : line5, "F#5" : line5, "Fx5" : line5, 
    "Gbb5" : spaceAboveStaff, "Gb5" : spaceAboveStaff, "G5" : spaceAboveStaff, "G#5" : spaceAboveStaff, "Gx5" : spaceAboveStaff, 
    "Abb5" : ledgerAbove1, "Ab5" : ledgerAbove1, "A5" : ledgerAbove1, "A#5" : ledgerAbove1, "Ax5" : ledgerAbove1,  
    "Bbb5" : spaceAboveLedger1, "Bb5" : spaceAboveLedger1, "B5" : spaceAboveLedger1, "B#5" : spaceAboveLedger1, "Bx5" : spaceAboveLedger1, 
    "Cbb6" : ledgerAbove2, "Cb6" : ledgerAbove2, "C6" : ledgerAbove2, "C#6" : ledgerAbove2, "Cx6" : ledgerAbove2,
    "Dbb6" : spaceAboveLedger2, "Db6" : spaceAboveLedger2, "D6" : spaceAboveLedger2, "D#6" : spaceAboveLedger2, "Dx6" : spaceAboveLedger2, 
    "Ebb6" : ledgerAbove3, "Eb6" : ledgerAbove3, "E6" : ledgerAbove3, "E#6" : ledgerAbove3, "Ex6" : ledgerAbove3
};

var BassStaffMap = {  
    "Abb1" : ledgerBelow3, "Ab1" : ledgerBelow3, "A1" : ledgerBelow3, "A#1" : ledgerBelow3, "Ax1" : ledgerBelow3, 
    "Bbb1" : spaceBelowLedger2, "Bb1" : spaceBelowLedger2, "B1" : spaceBelowLedger2, "B#1" : spaceBelowLedger2, "Bx1" : spaceBelowLedger2, 
    "Cbb2" : ledgerBelow2, "Cb2" : ledgerBelow2, "C2" : ledgerBelow2, "C#2" : ledgerBelow2, "Cx2" : ledgerBelow2,
    "Dbb2" : spaceBelowLedger1, "Db2" : spaceBelowLedger1, "D2" : spaceBelowLedger1, "D#2" : spaceBelowLedger1, "Dx2" : spaceBelowLedger1,
    "Ebb2" : ledgerBelow1, "Eb2" : ledgerBelow1, "E2" : ledgerBelow1, "E#2" : ledgerBelow1, "Ex2" : ledgerBelow1,
    "Fbb2" : spaceBelowStaff, "Fb2" : spaceBelowStaff, "F2" : spaceBelowStaff, "F#2" : spaceBelowStaff, "Fx2" : spaceBelowStaff, 
    "Gbb2" : line1, "Gb2" : line1, "G2" : line1, "G#2" : line1, "Gx2" : line1, 
    "Abb2" : space1, "Ab2" : space1, "A2" : space1, "A#2" : space1, "Ax2" : space1, 
    "Bbb2" : line2, "Bb2" : line2, "B2" : line2, "B#2" : line2, "Bx2" : line2, 
    "Cbb3" : space2, "Cb3" : space2, "C3" : space2, "C#3" : space2, "Cx3" : space2, 
    "Dbb3" : line3, "Db3" : line3, "D3" : line3, "D#3" : line3, "Dx3" : line3, 
    "Ebb3" : space3, "Eb3" : space3, "E3" : space3, "E#3" : space3, "Ex3" : space3, 
    "Fbb3" : line4, "Fb3" : line4, "F3" : line4, "F#3" : line4, "Fx3" : line4, 
    "Gbb3" : space4, "Gb3" : space4, "G3" : space4, "G#3" : space4, "Gx3" : space4, 
    "Abb3" : line5, "Ab3" : line5, "A3" : line5, "A#3" : line5, "Ax3" : line5, 
    "Bbb3" : spaceAboveStaff, "Bb3" : spaceAboveStaff, "B3" : spaceAboveStaff, "B#3" : spaceAboveStaff, "Bx3" : spaceAboveStaff, 
    "Cbb4" : ledgerAbove1, "Cb4" : ledgerAbove1, "C4" : ledgerAbove1, "C#4" : ledgerAbove1, "Cx4" : ledgerAbove1,  
    "Dbb4" : spaceAboveLedger1, "Db4" : spaceAboveLedger1, "D4" : spaceAboveLedger1, "D#4" : spaceAboveLedger1, "Dx4" : spaceAboveLedger1, 
    "Ebb4" : ledgerAbove2, "Eb4" : ledgerAbove2, "E4" : ledgerAbove2, "E#4" : ledgerAbove2, "Ex4" : ledgerAbove2,
    "Fbb4" : spaceAboveLedger2, "Fb4" : spaceAboveLedger2, "F4" : spaceAboveLedger2, "F#4" : spaceAboveLedger2, "Fx4" : spaceAboveLedger2, 
    "Gbb4" : ledgerAbove3, "Gb4" : ledgerAbove3, "G4" : ledgerAbove3, "G#4" : ledgerAbove3, "Gx4" : ledgerAbove3 
};

//---------------------------------------------
var numbersToFinaleFontUpStem = {
	"96": "w", 
	"72": "h.", "48": "h", "32": "ht",
	"36": "q.", "24": "q", "16": "qt",
	"18": "e.", "12": "e", "8": "et",
	"9": "x.", "6": "x", "4": "xt",

	"-96": "alt+0183", 
	"-72": "alt+0238+.", "-48": "alt+0238", "-32": "alt+0238t",
	"-36": "alt+0206+.", "-24": "alt+0206", "-16": "alt+0206t",
	"-18": "alt+0228+.", "-12": "alt+0228", "-8": "alt+0228t",
	"-9": "alt+0197+.", "-6": "alt+0197", "-4": "alt+0197t"
};

var numbersToFinaleFontDownStem = {
	"96": "w", 
	"72": "H.", "48": "H", "32": "Ht",
	"36": "Q.", "24": "Q", "16": "Qt",
	"18": "E.", "12": "E", "8": "Et",
	"9": "X.", "6": "X", "4": "Xt",

	"-96": "alt+0183", 
	"-72": "alt+0238+.", "-48": "alt+0238", "-32": "alt+0238t",
	"-36": "alt+0206+.", "-24": "alt+0206", "-16": "alt+0206t",
	"-18": "alt+0228+.", "-12": "alt+0228", "-8": "alt+0228t",
	"-9": "alt+0197+.", "-6": "alt+0197", "-4": "alt+0197t"
};
//-------------------------------------------------*/


function updateNotation() {
    let showNotation = document.getElementById("showNotation").checked;
    var message = "intervalScreen = " + intervalScreen + ", scaleScreen = " + scaleScreen + ", chordScreen = " + chordScreen;
//    console.log(message);
    if (intervalScreen) {
        clearCanvas(canvas, ctx);
        drawStaff(ctx, 50);
        drawClef(ctx, "treble");
        if(showNotation) {
            if(intervalNotesSaved != "")
                drawScale(ctx, intervalNotesSaved);
        }
    }
    else if (scaleScreen) {
        clearCanvas(canvas, ctx);
        drawStaff(ctx, 50);
        drawClef(ctx, "treble");
        if(showNotation) {
            if(scaleNotesSaved != "")
                drawScale(ctx, scaleNotesSaved);
        }
    }
    else if (chordScreen) {
        clearCanvas(canvas, ctx);
        drawStaff(ctx, 50);
        drawClef(ctx, "treble");
        if(showNotation) {
            if(chordNotesSaved != "")
//                drawChord(ctx, chordNotesSaved);  
                drawChord(ctx, 100, chords[i]);
        }
    }
    else if (chordProgScreen) {
        clearCanvas(canvas, ctx);
        drawStaff(ctx, 50);
        drawClef(ctx, "treble");
        if(showNotation) {
            if(chordNotesSaved != "")
//                drawChord(ctx, chordNotesSaved);  
                drawChord(ctx, 100, chords[i]);
        }
    }
    else if (testIntervalScreen) {
        clearCanvas(canvas, ctx);
        drawStaff(ctx, 50);
        drawClef(ctx, "treble");
        if(showNotation) {
            if(intervalNotesSaved != "")
                drawScale(ctx, intervalNotesSaved);
        }
    }
    else if (testScaleScreen) {
        clearCanvas(canvas, ctx);
        drawStaff(ctx, 50);
        drawClef(ctx, "treble");
        if(showNotation) {
            if(scaleNotesSaved != "")
                drawScale(ctx, scaleNotesSaved);
        }
    }
    else {
        clearCanvas(canvas, ctx);
        drawStaff(ctx, 50);
        drawClef(ctx, "treble");    
    }
}


function updateKey()  {
    var xLoc = 100;
    var key = document.myForm.key.value;
    clearCanvas(canvas, ctx);
    drawStaff(ctx, 50);
    drawClef(ctx, "treble");
    drawNote(ctx, xLoc, key);
}


function updateScale()  {
    var scale = getScaleData();
    clearCanvas(canvas, ctx);
    drawStaff(ctx, 50);
    drawClef(ctx, "treble");
    drawScale(ctx, scale);
}


function updateChord()  {
    var chord = getChordData();
    clearCanvas(canvas, ctx);
    drawStaff(ctx, 50);
    drawClef(ctx, "treble");
    drawChord(ctx, chord);
//    drawChord(ctx, xLoc, chords[i]);
}


function drawStaff(staffLength) {
    var msg  = "drawStaff(), staffLength = " + staffLength;
//    console.log(msg);
    ctx.font= my36Font;
    var partLength = 10;
    var i;
    var mystaffLength = staffLength;
    for (i=0; i<mystaffLength; i++) {
        ctx.fillText("=", i*partLength, staffLocation);
    }
}




/*------------------------------------------
function drawClef(clef) {
    var msg  = "drawClef(), clef = " + clef;
//    console.log(msg);
    ctx.font = my36Font;
    var yLoc = space2;  // default for treble clef
    var xLoc = 20;
    if (clef == "treble") {
        ctx.fillText("&", xLoc, yLoc);
    }
    if (clef == "bass") {
        yLoc = line5 + lineSpaceScale*2;
        ctx.fillText("?", xLoc, yLoc);
    }
}

---------------------------------------------------*/


function getNoteDuration(duration, stemDirection) {
    if(stemDirection == true || duration === "w" || duration === "W") // true means up stem
        return duration;  // up stem note
    else
        return duration.toUpperCase();  // uppercase = down stem notes
}

//------------------------------- new code ------------------------------------

var scaleFactor = 1.0;
var STEM_LENGTH = 32*scaleFactor;
var STEM_OFFSET = 4*scaleFactor;
var xLocOffset = 5;
var yLocOffset = -4;
var LINE_LENGTH = 600;
var startX = 10 + xLocOffset;
var startY = yLocOffset;

function drawTheStaff(staff_len) {
    var staff_length = (staff_len === undefined)? LINE_LENGTH: staff_len;
    ctx.beginPath();
    // lines
    for (let i=0; i<5; i++) {
        ctx.moveTo( startX, (startY + line5 + (lineSpaceScale*2*i)) );
        ctx.lineTo( (startX + staff_length), (startY + line5 + (lineSpaceScale*2*i)) );
	    ctx.lineWidth = 1;
        ctx.stroke();
    }
}


function drawDownStem(x, y) {
	var startX = x + xLocOffset;;
	var startY = y + yLocOffset;;

	ctx.beginPath();
    ctx.moveTo(startX-STEM_OFFSET, startY);
    ctx.lineTo(startX-STEM_OFFSET, startY + STEM_LENGTH);
	ctx.lineWidth = 1;
//	ctx.strokeStyle = "#000000";
	ctx.stroke();
	ctx.closePath();
}

function drawUpStem(x, y) {
	var startX = x + xLocOffset;;
	var startY = y + yLocOffset;;

	ctx.beginPath();
    ctx.moveTo(startX+STEM_OFFSET, startY);
    ctx.lineTo(startX+STEM_OFFSET, startY - STEM_LENGTH);
	ctx.lineWidth = 1;
//	ctx.strokeStyle = "#000000";
	ctx.stroke();
	ctx.closePath();
}

function drawTheNote(xLoc, note, duration) {
    var noteLoc = TrebleStaffMap[note];
    var myDuration = (duration === undefined)? "q": duration;
    var stemDirection = (noteLoc > line3);
    if(myDuration !== 'q') {
        if(stemDirection === false && duration === 'e') { // down stem
            myDuration = myDuration + '-downstem';
        }
        return drawFont(xLoc, noteLoc, myDuration);
    }
    drawNoteHead(xLoc, noteLoc);
    drawStem(xLoc, noteLoc, stemDirection);
    // drawFlag(xLoc, noteLoc, stemDirection)
}


function drawStem(xLoc, noteLoc, stemDirection) {
    if(stemDirection === true) {
       drawUpStem(xLoc, noteLoc);
    } else {
       drawDownStem(xLoc, noteLoc);    
    }
}



function drawNoteHead(x, y) {
	var centerX = x + xLocOffset;
	var centerY = y + yLocOffset;
	var radiusX = 5*scaleFactor;
	var radiusY = 3*scaleFactor;
	var rotation = 0.86;
	
	ctx.beginPath();
	for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
		xPos = centerX - (radiusY * Math.sin(i)) * Math.sin(rotation * Math.PI) + (radiusX * Math.cos(i)) * Math.cos(rotation * Math.PI);
		yPos = centerY + (radiusX * Math.cos(i)) * Math.sin(rotation * Math.PI) + (radiusY * Math.sin(i)) * Math.cos(rotation * Math.PI);
	
		if (i == 0) {
			ctx.moveTo(xPos, yPos);
		} else {
			ctx.lineTo(xPos, yPos);
		}
	}
//	ctx.fillStyle = "#000000";
	ctx.fill();
	ctx.lineWidth = 2;
//	ctx.strokeStyle = "#000000";
	ctx.stroke();
	ctx.closePath();
}
    var noteSpacing = 36;
    var BeginningXPos = 60;

function drawBeamUnder(x1,y1,x2,y2) {
	var startX = x1;
	var startY = y1+STEM_LENGTH;
	var endX = x2;
	var endY = y2+STEM_LENGTH;

	ctx.beginPath();
    ctx.moveTo(startX - STEM_OFFSET, startY);
    ctx.lineTo(endX - STEM_OFFSET, endY);
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#000000";
	ctx.stroke();
	ctx.closePath();
}


function drawBeamOver(x1,y1,x2,y2) {
	var startX = x1;
	var startY = y1-STEM_LENGTH;
	var endX = x2;
	var endY = y2-STEM_LENGTH;

	ctx.beginPath();
    ctx.moveTo(startX + STEM_OFFSET, startY);
    ctx.lineTo(endX + STEM_OFFSET, endY);
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#000000";
	ctx.stroke();
	ctx.closePath();
}

var myTrebleClefFont = "64px MusiSync";
var myBassClefFont = "50px MusiSync";

// MusiSync Fonts
var doubleBarline = String.fromCharCode(34);
var barline = String.fromCharCode(39);
var finalBarline = String.fromCharCode(93);
var repeatFromSign = String.fromCharCode(123);
var repeatSign = String.fromCharCode(125);
var startStaff = String.fromCharCode(168);
var staff = String.fromCharCode(169);
var endStaffFinal = String.fromCharCode(174);
var endStaffDblBar = String.fromCharCode(175);
var endStaff = String.fromCharCode(180);

var trebleClef = String.fromCharCode(71);
var smallTrebleClef = String.fromCharCode(103);
var bassClef = String.fromCharCode(39);

var wholeRest = String.fromCharCode(87);
var halfRest = String.fromCharCode(72);
var dottedHalfRest = String.fromCharCode(68);
var quarterRest = String.fromCharCode(81);
var dottedQuarterRest = String.fromCharCode(74);
var eighthRest = String.fromCharCode(69);
var dottedEighthRest = String.fromCharCode(73);
var sixteenthRest = String.fromCharCode(83);
var dottedsixteenthRest = String.fromCharCode(73);

var sixteenthNote = String.fromCharCode(115);
var eighthNote = String.fromCharCode(101);
//var eighthNote = String.fromCharCode(201);
var eighthNoteDownStem = String.fromCharCode(202);
var dottedEighthNote = String.fromCharCode(105);
var quarterNote = String.fromCharCode(113);
var quarterNoteDownStem = String.fromCharCode(246);
var dottedQuarterNote = String.fromCharCode(106);
var halfNote = String.fromCharCode(104);
var dottedHalfNote = String.fromCharCode(100);
var dottedWholeNote = String.fromCharCode(82);
var wholeNote = String.fromCharCode(119);
var doubleWholeNote = String.fromCharCode(122);

var sharp = String.fromCharCode(66);
var flat = String.fromCharCode(98);
var doubleSharp  = String.fromCharCode(88);
var doubleFlat  = String.fromCharCode(208);
var natural  = String.fromCharCode(189);

var meter2_2 = String.fromCharCode(33);
var cutTime = String.fromCharCode(67);
var meter3_2 = String.fromCharCode(76);
var meter4_2 = String.fromCharCode(75);

var meter2_4 = String.fromCharCode(87);
var meter3_4 = String.fromCharCode(35);
var meter4_4 = String.fromCharCode(36);
var commonTime = String.fromCharCode(99);
var meter5_4 = String.fromCharCode(37);
var meter6_4 = String.fromCharCode(94);
var meter7_4 = String.fromCharCode(198);
var meter8_4 = String.fromCharCode(197);
var meter9_4 = String.fromCharCode(178);

var meter2_8 = String.fromCharCode(107);
var meter3_8 = String.fromCharCode(41);
var meter4_8 = String.fromCharCode(193);
var meter6_8 = String.fromCharCode(80);
var meter9_8 = String.fromCharCode(40);
var meter12_8 = String.fromCharCode(192);


function drawClef(clef, xLocation) {
    var msg  = "drawClef2(), clef = " + clef;
    var xLoc = xLocation ? xLocation : 20;
//    console.log(msg);
    ctx.font = myTrebleClefFont;
    var yLoc = line1;  // default for treble clef MusiSync font
    var trebleClef = String.fromCharCode(71);
    var bassClef = String.fromCharCode(63);
    if (clef == "treble") {
        ctx.fillText(trebleClef, xLoc, yLoc);
    }
    if (clef == "bass") {
        ctx.font = myBassClefFont;
        yLoc = line2 + lineSpaceScale*1 + 2;
        ctx.fillText(bassClef, xLoc, yLoc);        
    }
}


var durationToMusiSyncFont = {
    'treble': trebleClef,
    'bass': bassClef,
    'e' : eighthNote,
    'e-downstem': eighthNoteDownStem,
    'e.' : dottedEighthNote,
    'q.': dottedQuarterNote,
    'q': quarterNote,
    'x' : sixteenthNote,
    'er': eighthRest,
    'Er': eighthRest,
    'qr': quarterRest,
    'Qr': quarterRest,
    'hr': halfRest,
    'Hr': halfRest,
    'wr': wholeRest,
    'Wr': wholeRest
}

function drawFont(x, y, duration) {
    var msg  = "drawFont(), duration = " + duration;
    console.log(msg);
    var eighthOffsetY = lineSpaceScale*4;
    var quarterOffsetY = lineSpaceScale*5;
    var halfOffsetY = lineSpaceScale*2 + 3;
    var wholeOffsetY = lineSpaceScale*3 + 3;
    var downStemOffsetY = lineSpaceScale*6;
    var yLoc = y;
    var xLoc = x;
    ctx.font = myBassClefFont;

    if(duration == 'e') {
//        yLoc += noteOffsetY; 
    } else if(duration == 'er') {
        yLoc += eighthOffsetY; 
    } else if(duration == 'qr') {
        yLoc += quarterOffsetY; 
    } else if(duration == 'hr') {
        yLoc += halfOffsetY; 
    } else if(duration == 'wr') {
        yLoc += wholeOffsetY; 
    } else if(duration == 'e-downstem') {
        yLoc += downStemOffsetY;
    }
    var noteDuration = durationToMusiSyncFont[duration];
    ctx.fillText(noteDuration, xLoc, yLoc);
}


//--------------------------------- end new code -----------------------------


function drawNote(xLoc, note, duration) {
    var msg  = "drawNote(), note = " + note;
//    console.log(msg);
    ctx.font = my36Font;
    var noteLoc = TrebleStaffMap[note];
    var accidental = getAccidental(note);
//    var message = "note=" + note + " noteLoc=" + noteLoc + " line5=" + line5;
//    console.log(message);

// \ = barline

    var myDuration = (duration === undefined)? "q": duration;
    var stemDirection = (noteLoc > line3);
    var noteDuration = getNoteDuration(myDuration, stemDirection);

//    ctx.fillText(noteDuration, xLoc, noteLoc);
// ---- the new drawing code ----------------------
    drawTheNote(xLoc, note, duration);
//    drawFont(xLoc, noteLoc, duration);

    ctx.font = my36Font;
    // add ledgerline(s) below staff if needed
    if (noteLoc > spaceBelowStaff) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerBelow1-ledgerLineYOffset);
    }
    if (noteLoc > spaceBelowLedger1) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerBelow2-ledgerLineYOffset);
    }
    // add ledgerline(s) above staff if needed
    if (noteLoc < spaceAboveStaff) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerAbove1-ledgerLineYOffset);
    }
    if (noteLoc < spaceAboveLedger1) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerAbove2-ledgerLineYOffset);
    }
    
    // add accidentals if needed
    if (accidental == "sharp") {
        ctx.fillText("#", xLoc-accidentalXOffset, noteLoc-accidentalYOffset);
    } else if (accidental == "flat") {
        ctx.fillText("b", xLoc-accidentalXOffset, noteLoc-accidentalYOffset);    
    } else if (accidental == "doubleFlat") {
        ctx.fillText("b", xLoc-(accidentalXOffset*2), noteLoc-accidentalYOffset);    
        ctx.fillText("b", xLoc-accidentalXOffset, noteLoc-accidentalYOffset);    
    } else if (accidental == "doubleSharp") {
        // I can't get the official doubleSharp character to display
        // in Maestro doubleSharp is (aledgedly) option/shift x
        // in MaestroTimes doubleSharp is option x
        // each of those quoted character strings result is something else
        // so I'm use a regular x from the MaestroTimes font

        ctx.font = "24px MaestroTimes";

        ctx.fillText("x", xLoc-accidentalXOffset, noteLoc+(accidentalYOffset/3));
        ctx.font = my36Font;
    }     
}


function drawColoredNote(note, color, duration) {
    var msg  = "drawColoredNote(), note = " + note;
    console.log(msg);

    var theNote;
    // adjustName is in playPracticeRoom.js, without the PracticeRoom app use drawTheColoredNote(note, color, duration)
    theNote = adjustName(note);
    ctx.font = my36Font;
    var noteLoc = TrebleStaffMap[theNote];
    var accidental = getAccidental(theNote);

    var xLoc = noteXLocations[note];
    
    var message = "note=" + note + " adjustedNote=" + theNote + " xLoc=" + xLoc + " noteLoc=" + noteLoc + " accidental=" + accidental;
    console.log(message);

    // turn the previous animated note "off" (back to black color)
    if (lastAnimatedNote !== undefined)  {
        drawNote(noteXLocations[lastAnimatedNote], lastAnimatedNote);  // ADJUST CODE HERE noteXLocations[note] 'note' needs to have a note number appended to it will be a unique key
    }

    ctx.fillStyle = color; // change color for the animated note
    ctx.strokeStyle = color; // change color for the animated note

// \ = barline

    var myDuration = (duration === undefined)? "q": duration;
    var stemDirection = (noteLoc > line3);
    var noteDuration = getNoteDuration(myDuration, stemDirection);
    // draw the note
//    ctx.fillText(noteDuration, xLoc, noteLoc);
// ---- the new drawing code ----------------------
    drawTheNote(xLoc, note, duration);

    // add ledgerline(s) below staff if needed
    if (noteLoc > spaceBelowStaff) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerBelow1-ledgerLineYOffset);
    }
    if (noteLoc > spaceBelowLedger1) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerBelow2-ledgerLineYOffset);
    }
    // add ledgerline(s) above staff if needed
    if (noteLoc < spaceAboveStaff) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerAbove1-ledgerLineYOffset);
    }
    if (noteLoc < spaceAboveLedger1) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerAbove2-ledgerLineYOffset);
    }
    
    // add accidentals if needed
    if (accidental == "sharp") {
        ctx.fillText("#", xLoc-accidentalXOffset, noteLoc-accidentalYOffset);
    }
    else if (accidental == "flat") {
        ctx.fillText("b", xLoc-accidentalXOffset, noteLoc-accidentalYOffset);    
    }
    else if (accidental == "doubleSharp") {
        // I can't get the official doubleSharp character to display
        // in Maestro doubleSharp is (aledgedly) option/shift x
        // in MaestroTimes doubleSharp is option x
        // each of those quoted character strings result is something else
        // so I'm use a regular x from the MaestroTimes font
        ctx.font = "24px MaestroTimes";
        ctx.fillText("x", xLoc-accidentalXOffset, noteLoc+(accidentalYOffset/3));
        ctx.font = my36Font; // restore regular font
    }     
    lastAnimatedNote = theNote;
    ctx.fillStyle = "black";  // change back to normal color
    ctx.strokeStyle = "black";  // change back to normal color
}


function drawTheColoredNote(note, color, duration) {
    var msg  = "drawTheColoredNote(), note = " + note;
//    console.log(msg);

    var theNote = note;
    ctx.font = my36Font;
    var noteLoc = TrebleStaffMap[theNote];
    var accidental = getAccidental(theNote);

    var xLoc = noteXLocations[note];
    
    var message = "note=" + note + " adjustedNote=" + theNote + " xLoc=" + xLoc + " noteLoc=" + noteLoc + " accidental=" + accidental;
//    console.log(message);

    // turn the previous animated note "off" (back to black color)
    if (lastAnimatedNote !== undefined)  {
        drawNote(noteXLocations[lastAnimatedNote], lastAnimatedNote);  // ADJUST CODE HERE noteXLocations[note] 'note' needs to have a note number appended to it will be a unique key
    }

    ctx.fillStyle = color; // change color for the animated note
    ctx.strokeStyle = color; // change color for the animated note

// \ = barline

    var myDuration = (duration === undefined)? "q": duration;
    var stemDirection = (noteLoc > line3);
    var noteDuration = getNoteDuration(myDuration, stemDirection);
    // draw the note
//    ctx.fillText(noteDuration, xLoc, noteLoc);
// ---- the new drawing code ----------------------
    drawTheNote(xLoc, note, duration);

    // add ledgerline(s) below staff if needed
    if (noteLoc > spaceBelowStaff) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerBelow1-ledgerLineYOffset);
    }
    if (noteLoc > spaceBelowLedger1) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerBelow2-ledgerLineYOffset);
    }
    // add ledgerline(s) above staff if needed
    if (noteLoc < spaceAboveStaff) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerAbove1-ledgerLineYOffset);
    }
    if (noteLoc < spaceAboveLedger1) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerAbove2-ledgerLineYOffset);
    }
    
    // add accidentals if needed
    if (accidental == "sharp") {
        ctx.fillText("#", xLoc-accidentalXOffset, noteLoc-accidentalYOffset);
    }
    else if (accidental == "flat") {
        ctx.fillText("b", xLoc-accidentalXOffset, noteLoc-accidentalYOffset);    
    }
    else if (accidental == "doubleSharp") {
        // I can't get the official doubleSharp character to display
        // in Maestro doubleSharp is (aledgedly) option/shift x
        // in MaestroTimes doubleSharp is option x
        // each of those quoted character strings result is something else
        // so I'm use a regular x from the MaestroTimes font
        ctx.font = "24px MaestroTimes";
        ctx.fillText("x", xLoc-accidentalXOffset, noteLoc+(accidentalYOffset/3));
        ctx.font = my36Font; // restore regular font
    }     
    lastAnimatedNote = theNote;
    ctx.fillStyle = "black";  // change back to normal color
    ctx.strokeStyle = "black";  // change back to normal color
}


function drawChordNote(xLoc, note, duration) {
    var msg  = "drawChordNote(), note = " + note;
//    console.log(msg);

    ctx.font = my36Font;
    var noteLoc = TrebleStaffMap[note];
    var accidental = getAccidental(note);
//    var message = "note=" + note + " noteLoc=" + noteLoc + " line5=" + line5;
//    console.log(message);

// \ = barline

    var myDuration = (duration === undefined)? "q": duration;
    var stemDirection = (noteLoc > line3);
    // keep all stems up (true) for now
    var noteDuration = getNoteDuration(myDuration, true);
    ctx.fillText(noteDuration, xLoc, noteLoc);

    // add ledgerline if needed
    if (noteLoc > spaceBelowStaff) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerBelow1-ledgerLineYOffset);
    }
    if (noteLoc > spaceBelowLedger1) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerBelow2-ledgerLineYOffset);
    }
    
    // add accidentals if needed
    if (accidental == "sharp") {
        ctx.fillText("#", xLoc-accidentalXOffset, noteLoc-accidentalYOffset);
    }
    else if (accidental == "flat") {
        ctx.fillText("b", xLoc-accidentalXOffset, noteLoc-accidentalYOffset);    
    }
    else if (accidental == "doubleSharp") {
        // I can't get the official doubleSharp character to display
        // in Maestro doubleSharp is option/shift x
        // in MaestroTimes doubleSharp is option x
        // each of those quoted character strings result is something else
        // so I'm use a regular x from the MaestroTimes font

        ctx.font = "24px MaestroTimes";

        ctx.fillText("x", xLoc-accidentalXOffset, noteLoc+(accidentalYOffset/3));
        ctx.font = my36Font;
    }     
}

function getAccidental(note) {
    var msg  = "getAccidental(), note = " + note;
//    console.log(msg);
    var accidentalType = "";
    if (note.includes('bb'))
        accidentalType = "doubleFlat";
    else if (note.includes('b'))
        accidentalType = "flat";
    else if (note.includes('x'))
        accidentalType = "doubleSharp";
    else if (note.includes('#'))
        accidentalType = "sharp";
    
    return accidentalType;
}


function clearCanvas() {
//    console.log("clearCanvas()");
    ctx.strokeStyle="#FFFFFF";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle="#000000";
    ctx.fillStyle = '#000000';
}

//var noteXLocations = {};  // for scale animation in notation
var noteXLocations = [];  // for scale animation in notation

function drawScale(scaleNotes, rhythms) {
    chordXLocation = [];
    var msg  = "drawScale(), notes = " + scaleNotes;
//    console.log(msg);
    var i;
//    var noteSpacing = 50;
    for (i=0; i < scaleNotes.length; i++) {
        // skip scaleNotes[i] when it's blank
        if(scaleNotes[i] != "") {
            if(rhythms === undefined)
                drawNote((noteSpacing*(i+2)), scaleNotes[i]);
            else
                drawNote((noteSpacing*(i+2)), scaleNotes[i], rhythms[i]);
        }
        // ADJUST CODE HERE noteXLocations[note] 'note' needs to have a note number appended to it will be a unique key
        noteXLocations[scaleNotes[i]] = noteSpacing*(i+2);  
//        console.log("noteXLocations["+scaleNotes[i]+"]="+noteXLocations[scaleNotes[i]])
    }
    
}

var chordXLocations = []; // for chord progression animation in notation


function clearLastAnimatedNote() {
//    console.log("clearLastAnimatedNote()");
    lastAnimatedNote = undefined;
}

//function drawChord(xLoc, chordNotes, duration) {
function drawChord(xLoc, chordNotes) {
    var msg  = "drawChord(), chordNotes = " + chordNotes;
//    console.log(msg);
    var i;
    var noteSpacing = 50;
    for (i=0; i < chordNotes.length; i++) {
        drawChordNote(xLoc, chordNotes[i]);
    }
}


//function drawChordProgression(chordProgression, duration) {
function drawChordProgression(chordProgression) {
    var msg  = "drawChordProgression(), chordProgression = " + chordProgression;
//    console.log(msg);
    var noteSpacing = 50;
    var chordNotes;
    for(let j=0; j<chordProgression.length; j++) {
        chordNotes = chordProgression[j];
        for (let i=0; i < chordNotes.length; i++) {
            drawChordNote(ctx, (noteSpacing*2)*(j+1), chordNotes[i]);
        }

    }
}

function setNoteSpacing(spacing) {
    noteSpacing = (spacing > 80)? 80: spacing;
}


	return {
		drawClef: drawClef,
//		drawStaff: drawStaff,
		drawTheStaff: drawTheStaff,
		drawChordNote: drawChordNote,
		drawColoredNote: drawColoredNote,
		drawTheColoredNote: drawTheColoredNote,
		drawNote: drawNote,
		clearCanvas: clearCanvas,
		drawScale: drawScale,
		drawChord: drawChord,
		drawChordProgression: drawChordProgression,
		clearLastAnimatedNote: clearLastAnimatedNote,
		setNoteSpacing: setNoteSpacing
	};

}
