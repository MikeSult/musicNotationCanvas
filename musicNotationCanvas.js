//------------------------------------------------------------------------------
// musicNotationCanvas.js
//
// cd ~/Documents/Github/musicNotationCanvas/
//------------------------------------------------------------------------------
// assumes there is a canvas element with the id matching the canvas_id param
// if no param the default id is 'myCanvas' <canvas id='myCanvas'> is assumed on the page
//

function MusicNotation(canvas_id) {

var canvasID = canvas_id? canvas_id : 'myCanvas';
var canvas = document.getElementById(canvasID);
var ctx = canvas.getContext("2d");

// line5 value determines the vertical location of the staff
//var line5 = 40; 
var line5 = 60; 
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
var ledgerBelow4 = spaceBelowLedger3 + lineSpaceScale;
var spaceBelowLedger4 = ledgerBelow4 + lineSpaceScale;


var spaceAboveStaff = line5 - lineSpaceScale;
var ledgerAbove1 = spaceAboveStaff - lineSpaceScale;
var spaceAboveLedger1 = ledgerAbove1 - lineSpaceScale;
var ledgerAbove2 = spaceAboveLedger1 - lineSpaceScale;
var spaceAboveLedger2 = ledgerAbove2 - lineSpaceScale;
var ledgerAbove3 = spaceAboveLedger2 - lineSpaceScale;
var spaceAboveLedger3 = ledgerAbove3 - lineSpaceScale;
var ledgerAbove4 = spaceAboveLedger3 - lineSpaceScale;
var spaceAboveLedger4 = ledgerAbove4 - lineSpaceScale;

var ledgerLineXOffset = 2;
var ledgerLineYOffset = 3; // this worked until I got the new macBook
//var ledgerLineYOffset = 7; // now this seems to be the value that is needed. WTF?
// NOTE: it turned out that the Maestro and MusiSync fonts were not yet installed 
// and the spacing was differrent.  It's fixed now that the fonts are installed
var accidentalXOffset = 12;
var accidentalYOffset = 4;

var noteSpacing = 50; // default, use Notation.setNoteSpacing(space) to change

var myClefFont = "54px MusiSync";
//var my24Font = "24px MusiSync";

var my36Font = "36px Maestro";
var my24Font = "24px Maestro";

var lastAnimatedNote; // so you can turn it back to normal as you animate another note

var useBassClef = false;
var myMeter = '';
var currentLocation = 0;

var TrebleStaffMap = {  
    "Cbb3" : spaceBelowLedger4, "Cb3" : spaceBelowLedger4, "C3" : spaceBelowLedger4, "C#3" : spaceBelowLedger4, "Cx3" : spaceBelowLedger4,
    "Dbb4" : ledgerBelow4, "Db3" : ledgerBelow4, "D3" : ledgerBelow4, "D#3" : ledgerBelow4, "Dx3" : ledgerBelow4, 
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
    "Ebb6" : ledgerAbove3, "Eb6" : ledgerAbove3, "E6" : ledgerAbove3, "E#6" : ledgerAbove3, "Ex6" : ledgerAbove3, 
    "Fb6"  : spaceAboveLedger3, "F6"  : spaceAboveLedger3,  "F#6"  : spaceAboveLedger3, "Fx6" : spaceAboveLedger3,
    "Gbb6" : ledgerAbove4, "Gb6" : ledgerAbove4, "G6" : ledgerAbove4, "G#6" : ledgerAbove4, "Gx6" : ledgerAbove4, 
    "Ab6"  : spaceAboveLedger4, "A6"  : spaceAboveLedger4,  "A#6"  : spaceAboveLedger4, "Ax6" : spaceAboveLedger4

};

var BassStaffMap = {  
    "Ebb1" : spaceBelowLedger4, "Eb1" : spaceBelowLedger4, "E1" : spaceBelowLedger4, "E#1" : spaceBelowLedger4, "Ex1" : spaceBelowLedger4, 
    "Fbb1" : ledgerBelow4, "Fb1" : ledgerBelow4, "F1" : ledgerBelow4, "F#1" : ledgerBelow4, "Fx1" : ledgerBelow4, 
    "Gbb1" : spaceBelowLedger3, "Gb1" : spaceBelowLedger3, "G1" : spaceBelowLedger3, "G#1" : spaceBelowLedger3, "Gx1" : spaceBelowLedger3, 
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
    "Gbb4" : ledgerAbove3, "Gb4" : ledgerAbove3, "G4" : ledgerAbove3, "G#4" : ledgerAbove3, "Gx4" : ledgerAbove3,
    'Abb4' : spaceAboveLedger3, 'Ab4' : spaceAboveLedger3, 'A4' : spaceAboveLedger3, 'Ax4' : spaceAboveLedger3, 
    "Bbb4" : ledgerAbove4, "Bb4" : ledgerAbove4, "B4" : ledgerAbove4, "B#4" : ledgerAbove4, "Bx4" : ledgerAbove4,
    'Cbb5' : spaceAboveLedger4, 'Cb5' : spaceAboveLedger4, 'C5' : spaceAboveLedger4, 'Cx5' : spaceAboveLedger4 
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

/*-------------------------------------------
	const wholeNote = 96.0;
	const wholeNoteT = 64.0;
	const halfNote = 48.0;
	const halfNoteT = 32.0;
	const quarterNote = 24.0;
	const quarterNoteT = 16.0;
	const eighthNote = 12.0;
	const eighthNoteT = 8.0;
	const sixteenthNote = 6.0;
	const sixteenthNoteT = 4.0;
	const thirtysecondNote = 3.0;
	const thirtysecondNoteT = 2.0;
//---------------------------------------------*/
	const wholeNote_num = 96.0;
	const wholeNoteT_num = 64.0;
	const halfNote_num = 48.0;
	const halfNoteT_num = 32.0;
	const quarterNote_num = 24.0;
	const quarterNoteT_num = 16.0;
	const eighthNote_num = 12.0;
	const eighthNoteT_num = 8.0;
	const sixteenthNote_num = 6.0;
	const sixteenthNoteT_num = 4.0;
	const thirtysecondNote_num = 3.0;
	const thirtysecondNoteT_num = 2.0;

	var rhythmTextToNumbers = {
		"1n" : 96, 
		"d2n" : 72, "2n." : 72, "2n" : 48, "2t" : 32,
		"d4n" : 36, "4n." : 36, "4n" : 24, "4t" :  16,
		"d8n" : 18, "8n." : 18, "8n" : 12, "8t" : 8,
		"d16n" : 9, "16n." : 9, "16n" : 6, "16t" : 4,
	
		"1r" : -96, 
		"d2r" : -72, "2r." : -72, "2r" : -48, "2tr" : -32,
		"d4r" : -36, "4r." : -36, "4r" : -24, "4tr" :  -16,
		"d8r" : -18, "8r." : -18, "8r" : -12, "8tr" : -8,
		"d16r" : -9, "16r." : -9, "16r" : -6, "16tr" : -4
	};
	

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

function drawBarline(xLocation, type) {
    var msg  = "drawBarline(), type = " + type;
//    console.log(msg);
    var barlineOffset = 4;
    var xLoc = xLocation ? xLocation : 160;
    var yLoc1 = line1-barlineOffset;
    var yLoc2 = line5-barlineOffset;

    var mytype = type; type: 'single';

	ctx.beginPath();
	ctx.lineWidth = 1;
    ctx.moveTo(xLoc, yLoc1);
    ctx.lineTo(xLoc, yLoc2);
	ctx.stroke();
	ctx.closePath();
	
    if(type=='double') {
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.moveTo(xLoc + 5, yLoc1);
		ctx.lineTo(xLoc + 5, yLoc2);
		ctx.stroke();
		ctx.closePath();
    } else if(type=='end') {
		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.moveTo(xLoc + 5, yLoc1);
		ctx.lineTo(xLoc + 5, yLoc2);
		ctx.stroke();
		ctx.closePath();
    }

}


function getNoteDuration(duration, stemDirection) {
    if(stemDirection == true || duration === "w" || duration === "W") // true means up stem
        return duration;  // up stem note
    else
        return duration.toUpperCase();  // uppercase = down stem notes (go figure)
}

//------------------------------- new code ------------------------------------

var scaleFactor = 1.0;
var STEM_LENGTH = 32*scaleFactor;
var myStemLength = STEM_LENGTH;
var STEM_OFFSET = 4*scaleFactor;
var xLocOffset = 5;
var yLocOffset = -4;
var LINE_LENGTH = 600;
var startX = 10 + xLocOffset;
var startY = yLocOffset;

var xLocFlagOffset = 10*scaleFactor;
var yLocFlagOffset = -2*scaleFactor;
var DOWNSTEM_FLAG_OFFSET = 9*scaleFactor;
var FLAG_LENGTH = 10*scaleFactor;
var FLAG_SPACING = 6*scaleFactor;
var DOT_OFFSET = 10*scaleFactor;

/*--------------------------------------------
var myNote = {
    noteType: '4n',
    noteheadLoc: [x, y],
    stemLength: myStemLength,
    flag: null,
    beamGroups: { 
        singleBeamGroup: null,
        doubleBeamGroup: null,
        tripleBeamGroup: null,
        quadBeamGroup: null
    }
}

// example code for creating objects within a loop
function createNoteArray(durations, pitches, velocity, startTime) {
	if(pitches == "")
		return undefined;

	var myStartTime;
	if(startTime == undefined)
		myStartTime = 0;
	else
		myStartTime = startTime;

	var melody = [];
	var rhythmValue;
	var velocityValue;
	var time_array = processDurationNotation(durations, myStartTime);
	var all_durations = processDurationArrays(durations);
	var myDurations = removeRestsFromDurations(all_durations);
	var j = 0;
	for(var i=0; i<pitches.length; i++) {
		var oneNote = {};
		// loop thru the rhythm array until the pitch array is completed.
		j = j % time_array.length; 
		rhythmValue = time_array[j];
		velocityValue = (velocity !== undefined && velocity !== 0) ? velocity[i] : 0.7; 

		// if pitches[i] is a single note just add the one note object
		if(typeof(pitches[i]) == 'string') {
			var oneNote = {};
			Object.defineProperties(oneNote, {
			  'time': {
				value: rhythmValue,
			  },
			  'noteheadLoc': {
				value: [x, y], // calc [x, y] using pitches[i],
			  },
			  'noteType': {
				value: myDurations[i],
			  },
			  'stemLength': {
				value: STEM_LENGTH,
			  }.
			  'flag': {
			    value: null; // calc using noteType
			  },
			  'beamGroups': {
			    value: null;  // calc using calcBeamLocations()
			  }
			});
			melody.push(oneNote);
		} else {
			// if pitches[i] is array do a loop over pitches[i].length
			for(var index=0; index<pitches[i].length; index++) { 
				var oneNote = {};
				// var myNoteheadLoc = [];// calc [x, y] using pitches[i],
				Object.defineProperties(oneNote, {
				  'time': {
					value: rhythmValue,
				  },
				  'noteheadLoc': {
					value: myNoteheadLoc, 
				  },
				  'noteType': {
					value: myDurations[i],
				  },
				  'stemLength': {
					value: STEM_LENGTH,
				  }.
				  'flag': {
					value: null; // calc using noteType
				  },
				  'beamGroups': {
					value: null;  // calc using calcBeamLocations()
				  }
				});
				melody.push(oneNote);
			}
		}

		j++;
		lastDuration = myDurations[i];
	}
	totalTime = rhythmValue + " + " + lastDuration;
	return melody;
}
	
//--------------------------------------------*/

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
	var startX = x + xLocOffset - STEM_OFFSET;
	var startY = y + yLocOffset;

	ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY + myStemLength);
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
}

function drawUpStem(x, y) {
	var startX = x + xLocOffset + STEM_OFFSET;
	var startY = y + yLocOffset;;

	ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY - myStemLength);
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
}

function drawTheNote(xLocation, note, duration) {
    if(useBassClef) {
        var noteLoc = BassStaffMap[note];
    } else {
        var noteLoc = TrebleStaffMap[note];
    }
    var xLoc = xLocation;
//    var xLoc = xLocation + currentLocation;
    var myDuration = (duration === undefined)? "q": duration;
    var stemDirection = (noteLoc > line3);
//    console.log('duration=' + duration + ' myDuration=' + myDuration + ' stemDirection=' + stemDirection);
/*------------------------------------
    if(myDuration !== 'q') {
        if(stemDirection === false && duration === 'e') { // down stem
            myDuration = myDuration + '-downstem';
        }
        return drawFont(xLoc, noteLoc, myDuration);
    }
//--------------------------------------*/
//    console.log(`xLoc = ${xLoc} noteLoc = ${noteLoc} myDuration = ${myDuration}`)
    drawNoteHead(xLoc, noteLoc, myDuration);
    if(!myDuration.includes("w") && !myDuration.includes("W") ) {
        drawStem(xLoc, noteLoc, stemDirection);
    }
    if(myDuration.includes("e") || myDuration.includes("x") ) {
        drawFlag(xLoc, noteLoc, stemDirection, myDuration)
    }
//    currentLocation += noteSpacing;
}

function drawText(xLoc, yLoc, text, fontsize) {
    const fontSize = fontsize? fontsize: 18;
    ctx.font = ""+fontSize+"px Times";
    ctx.fillText(text, xLoc, yLoc);
    ctx.font = my36Font;

}


function drawStem(xLoc, noteLoc, stemDirection) {
    if(stemDirection === true) {
       drawUpStem(xLoc, noteLoc);
    } else {
       drawDownStem(xLoc, noteLoc);    
    }
}


function drawFlag(xLoc, noteLoc, stemDirection, duration) {
    if(stemDirection === true) {
       drawUpStemFlag(xLoc, noteLoc, duration);
    } else {
       drawDownStemFlag(xLoc, noteLoc, duration);    
    }
}


function drawDownStemFlag(x, y, duration) {
	var startX = x + xLocFlagOffset - DOWNSTEM_FLAG_OFFSET;
	var startY = y + 2*yLocFlagOffset + STEM_LENGTH;

	ctx.beginPath();
	ctx.lineWidth = 3;
    ctx.moveTo(startX, startY);
    ctx.lineTo((startX + FLAG_LENGTH), (startY - FLAG_LENGTH));
	ctx.stroke();
	ctx.closePath();
	if(duration.includes("x")) {
	    ctx.beginPath();
	    ctx.lineWidth = 3;
        ctx.moveTo(startX, startY - FLAG_SPACING);
        ctx.lineTo((startX + FLAG_LENGTH), (startY - FLAG_SPACING - FLAG_LENGTH));
	    ctx.stroke();
	    ctx.closePath();
	}
}

function drawUpStemFlag(x, y, duration) {
	var startX = x + xLocFlagOffset;
	var startY = y + yLocFlagOffset - STEM_LENGTH;

	ctx.beginPath();
	ctx.lineWidth = 3;
    ctx.moveTo(startX, startY);
    ctx.lineTo((startX + FLAG_LENGTH), (startY + FLAG_LENGTH));
	ctx.stroke();
	ctx.closePath();
	if(duration.includes("x")) {
	    ctx.beginPath();
	    ctx.lineWidth = 3;
        ctx.moveTo(startX, startY + FLAG_SPACING);
        ctx.lineTo((startX + FLAG_LENGTH), (startY + FLAG_SPACING + FLAG_LENGTH));
	    ctx.stroke();
	    ctx.closePath();
	}
}

function drawNoteHead(x, y, duration) {
	var centerX = x + xLocOffset;
	var centerY = y + yLocOffset;
	var radiusX = 3*scaleFactor;
	var radiusY = 4*scaleFactor;
	var rotation = 0.86;
	
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.ellipse(centerX, centerY, radiusX, radiusY, Math.PI / 3, 0, 2 * Math.PI);	
    if(duration.includes("w") || duration.includes("h") || duration.includes("W") || duration.includes("H") ) {
	    ctx.stroke();
    } else {
	    ctx.stroke();
        ctx.fill();
    }
    
    if(duration.includes(".")) {
        ctx.closePath();
        ctx.beginPath();
        ctx.ellipse(centerX+DOT_OFFSET, centerY-2, 2, 2, Math.PI / 3, 0, 2 * Math.PI);	
        ctx.fill();
    }
//	ctx.closePath();
}

//    var noteSpacing = 36;
//    var BeginningXPos = 60;

//-----------------------------------------------------------
// 1. analyze entire phrase and locate which notes the 
//   beam groups start-ends for both eighth note beams and sixteenth note
//   beams. also calculate stem direction for each beamed group. 
// calcBeamLocations()
// 
// this function will calculate the starting and ending notes of beamed groups, 
// both eighth note beamed groups and sixteenth note beamed groups
function calcBeamLocations(timeSignature, scaleNotes, durations, num_pickup_notes) {
   var startBeamLoc;
   var endBeamLoc;
   var beamLocations = [];
   var oneBeamLocation = [];
   var beam_locations = [];
   var beamGroupStarted_eighth = false;
   var beamGroupStarted_sixteenth = false;
   var beamIncrement = 0;
   var currentCounterNum = 0;
   var currentFontLetter = '';
   var durationCounter = 0;
   var start = num_pickup_notes? Number(num_pickup_notes): 0;
   
   var isAllBeamable = false;
   var sixteenth_beam = [];
   var eighth_beam = [];
   var sixteenth_beam_locs = [];
   var eighth_beam_locs = [];
   

   // get numbers of the time signature
   var top_bottom = timeSignature.split('/');
   var top_num = top_bottom[0];
   var bottom_num = top_bottom[1];
   var beam_size_eighth = 0;
   var beam_size_sixteenth = 0;
   if (bottom_num == '8' && ((Number(top_num) % 3) == 0) ) {
       beam_size_eighth = 36;
       beam_size_sixteenth = 12;   
//       console.log('compound meter')
   } else {
       beam_size_eighth = 24;
       beam_size_sixteenth = 12;
//       console.log('simple meter')
   }
   
   for(let i=start; i<durations.length; i++) {
       currentDuration = durations[i];
       currentCounterNum = rhythmTextToNumbers[currentDuration];
       if(currentCounterNum <= eighthNote_num) {
           // check for triplet value in currentDurationNum
           if( [64, 32, 16, 8, 4, 2].includes(currentCounterNum) ) {
//               console.log('triplet detected: note number '+(i-start+1)+' currentCounterNum='+currentCounterNum)
           }

           // check for potential start beam at this durationCounter and currentCounterNum
           if(durationCounter % beam_size_eighth == 0 ) {
//               console.log('potential eighth note beam start - note number '+(i-start+1)+' durationCounter='+durationCounter+' currentCounterNum='+currentCounterNum)
               isAllBeamable = true;
               beamGroupStarted_eighth = true;
               eighth_beam[0] = i-start; // start eight beam group
//               console.log('start eighth beam: note '+(i-start+1))
           }
           if(durationCounter % beam_size_sixteenth == 0 && currentCounterNum <= sixteenthNote_num ) {
//               console.log('potential sixteen note beam start - note number '+(i-start+1)+' durationCounter='+durationCounter+' currentCounterNum='+currentCounterNum)
               isAllBeamable = true;
               beamGroupStarted_sixteenth = true;
               sixteenth_beam[0] = i-start;  // start sixteenth beam group
//               console.log('start sixteenth beam: note '+(i-start+1))
           }

           // check for potential end beam at this durationCounter and currentCounterNum
           if( (durationCounter != 0) 
                 && (durationCounter + currentCounterNum) % beam_size_eighth == 0 
                    && beamGroupStarted_eighth ) {
//               console.log('potential eighth beam end - note number '+(i-start+1)+' durationCounter='+durationCounter+' currentCounterNum='+currentCounterNum )
               eighth_beam[1] = i-start;  // end of eighth beam group
               beam_group_stem_direction_8 = calcBeamGroupStemDirection(scaleNotes, eighth_beam, 'treble');
               eighth_beam[2] = beam_group_stem_direction_8; // stem direction of beam group
               eighth_beam_locs.push(eighth_beam);
               eighth_beam = [];
               isAllBeamable = false;
               beamGroupStarted_eighth = false;
//               console.log('end eighth beam: note '+(i-start+1))
           }
           if( (durationCounter != 0) 
                 && (durationCounter + currentCounterNum) % beam_size_sixteenth == 0 
                    && currentCounterNum <= sixteenthNote_num  
                       && beamGroupStarted_sixteenth ) {
//               console.log('potential sixteenth beam end - note number '+(i-start+1)+' durationCounter='+durationCounter+' currentCounterNum='+currentCounterNum)
               sixteenth_beam[1] = i-start;
               beam_group_stem_direction_16 = calcBeamGroupStemDirection(scaleNotes, sixteenth_beam, 'treble');
               sixteenth_beam[2] = beam_group_stem_direction_16;
               sixteenth_beam_locs.push(sixteenth_beam);
               sixteenth_beam = [];
//               isAllBeamable = false;
               beamGroupStarted_sixteenth = false;
//               console.log('end sixteenth beam: note '+(i-start+1))
           }

           // check for potential interior beam at this durationCounter and currentCounterNum
           if( (durationCounter != 0) && (durationCounter + currentCounterNum) % beam_size_eighth != 0 && isAllBeamable) {
//               console.log('potential interior eighth beam end - note number '+(i-start+1)+' durationCounter='+durationCounter+' currentCounterNum='+currentCounterNum)
           }
           if( (durationCounter != 0) && (durationCounter + currentCounterNum) % beam_size_sixteenth != 0 && isAllBeamable) {
//               console.log('potential interior sixteenth beam end - note number '+(i-start+1)+' durationCounter='+durationCounter+' currentCounterNum='+currentCounterNum)
           }
       } else {
           isAllBeamable = false;
           beamGroupStarted_sixteenth = false;
           beamGroupStarted_eighth = false;
       }
       durationCounter += currentCounterNum;
   }
   beam_locations.push(eighth_beam_locs);
   beam_locations.push(sixteenth_beam_locs);
   return beam_locations;
   
}

function calcBeamGroupStemDirection(notes, start_end, clef) {
    var direction = true;
    var myClef = clef? clef: 'treble';
    var midiNums = 0;
    var midiAverage = 0;
    var numOfNotes = (start_end[1] - start_end[0]) + 1;
    for(var i=start_end[0]; i<=start_end[1]; i++) {
        midiNums += noteNameToMIDI(notes[i]);
    }
    midiAverage = midiNums/numOfNotes;
    
    if(clef == 'treble') {
        stem_down = 70;
    } else if(clef == 'bass') {
        stem_down = 50;    
    } else {
        // default treble
        stem_down = 70;
    }
    direction = (midiAverage < stem_down)? true: false;
    return direction;
}


// drawBeamGroup()
//
// 1. draw the noteheads.
// for note in notes: 
//   drawNoteHead(x, y, duration)
//
// 2. draw the stems using the beaming info (not pitch)
//   if(note in a beam_group) use beam_group[2] stem direction
//   else use regular pitch stem direction
//
// 3. draw the beams.
// for beam_group in beam_groups:
//   start = beam_group[0]
//   end = beam_group[1]
//   stem_direction = beam_group[2]
// 
//-----------------------------------------------------------

function drawBeamGroup(scaleNotes, rhythms, beam_info) {
    var i=0;
    var pitch_location;
    var first_pitch_loc = TrebleStaffMap[scaleNotes[beam_info[0]]];
    var last_pitch_loc = TrebleStaffMap[scaleNotes[beam_info[1]]];
    var first_note_loc = noteSpacing*(beam_info[0]+2)+currentLocation;
    var last_note_loc = noteSpacing*(beam_info[1]+2)+currentLocation;
    var isDoubleBeam = (rhythms[beam_info[0]] == 'x')? true: false;
    for (i=beam_info[0]; i <= beam_info[1]; i++) {
        if(scaleNotes[i] != "") {
            if(rhythms === undefined) { // this shouldn't happen but just in case...
                drawNote((noteSpacing*(i+2)+currentLocation), scaleNotes[i]);
            } else { // this is the normal path
                pitch_location = TrebleStaffMap[scaleNotes[i]];
                drawNoteHead((noteSpacing*(i+2)+currentLocation), pitch_location, rhythms[i]);
                if(beam_info[2] == true) {
                    drawUpStem((noteSpacing*(i+2)+currentLocation), pitch_location)
                } else {
                    drawDownStem((noteSpacing*(i+2)+currentLocation), pitch_location)
                }
            }
        }
        // ADJUST CODE HERE noteXLocations[note] 'note' needs to have a note number appended to it will be a unique key
        noteXLocations[scaleNotes[i]] = noteSpacing*(i+2)+currentLocation;     
    }
    if(beam_info[2] == true) {
        drawBeamOver(first_note_loc, first_pitch_loc, last_note_loc, last_pitch_loc);
        if(isDoubleBeam) {
            drawDoubleBeamOver(first_note_loc, first_pitch_loc, last_note_loc, last_pitch_loc);
        }
    } else {
        drawBeamUnder(first_note_loc, first_pitch_loc, last_note_loc, last_pitch_loc);
        if(isDoubleBeam) {
            drawDoubleBeamUnder(first_note_loc, first_pitch_loc, last_note_loc, last_pitch_loc);
        }
    }
}

var beam_h_padding = 5;
var beam_v_padding = -3;
var beam_v_double_over = -4;
var beam_v_double_under = -10;

function drawBeamUnder(x1,y1,x2,y2) {
	var startX = x1 + beam_h_padding;
	var startY = y1 + myStemLength + beam_v_padding;
	var endX = x2 + beam_h_padding;
	var endY = y2 + myStemLength + beam_v_padding;

	ctx.beginPath();
    ctx.moveTo(startX - STEM_OFFSET, startY);
    ctx.lineTo(endX - STEM_OFFSET, endY);
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#000000";
	ctx.stroke();
	ctx.closePath();
}

function drawDoubleBeamUnder(x1,y1,x2,y2) {
	var startX = x1 + beam_h_padding;
	var startY = y1 + myStemLength + beam_v_double_under;
	var endX = x2 + beam_h_padding;
	var endY = y2 + myStemLength + beam_v_double_under;

	ctx.beginPath();
    ctx.moveTo(startX - STEM_OFFSET, startY);
    ctx.lineTo(endX - STEM_OFFSET, endY);
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#000000";
	ctx.stroke();
	ctx.closePath();
}


function drawBeamOver(x1,y1,x2,y2) {
	var startX = x1 + beam_h_padding;
	var startY = y1 - myStemLength + beam_v_padding;
	var endX = x2 + beam_h_padding;
	var endY = y2 - myStemLength + beam_v_padding;

	ctx.beginPath();
    ctx.moveTo(startX + STEM_OFFSET, startY);
    ctx.lineTo(endX + STEM_OFFSET, endY);
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#000000";
	ctx.stroke();
	ctx.closePath();
}

function drawDoubleBeamOver(x1,y1,x2,y2) {
	var startX = x1 + beam_h_padding;
	var startY = y1 - myStemLength - beam_v_double_over;
	var endX = x2 + beam_h_padding;
	var endY = y2 - myStemLength - beam_v_double_over;

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

var meter2_4 = String.fromCharCode(64);
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
function drawTimeSignature(timeSignature, xLocation) {
    myMeter = timeSignature.slice();
    var xLoc = xLocation ? xLocation : 60;
    currentLocation = xLoc;
    var yLoc = line1;  // default for treble clef MusiSync font
    var msg  = "drawTimeSignature(), timeSignature = " + timeSignature+' currentLocation='+currentLocation;
//    console.log(msg);
    ctx.font = myTrebleClefFont;
    if (timeSignature == "4/4") {
        ctx.fillText(meter4_4, xLoc, yLoc);
    } else if (timeSignature == "c") {
        ctx.fillText(commonTime, xLoc, yLoc);
    } else if (timeSignature == "2/4") {
        ctx.fillText(meter2_4, xLoc, yLoc);
    } else if (timeSignature == "3/4") {
        ctx.fillText(meter3_4, xLoc, yLoc);
    } else if (timeSignature == "5/4") {
        ctx.fillText(meter5_4, xLoc, yLoc);
    } else if (timeSignature == "6/4") {
        ctx.fillText(meter6_4, xLoc, yLoc);
    } else if (timeSignature == "7/4") {
        ctx.fillText(meter7_4, xLoc, yLoc);
    } else if (timeSignature == "8/4") {
        ctx.fillText(meter8_4, xLoc, yLoc);
    } else if (timeSignature == "9/4") {
        ctx.fillText(meter9_4, xLoc, yLoc);

    } else if (timeSignature == "2/8") {
        ctx.fillText(meter2_8, xLoc, yLoc);
    } else if (timeSignature == "3/8") {
        ctx.fillText(meter3_8, xLoc, yLoc);
    } else if (timeSignature == "4/8") {
        ctx.fillText(meter4_8, xLoc, yLoc);
    } else if (timeSignature == "6/8") {
        ctx.fillText(meter6_8, xLoc, yLoc);
    } else if (timeSignature == "9/8") {
        ctx.fillText(meter9_8, xLoc, yLoc);
    } else if (timeSignature == "12/8") {
        ctx.fillText(meter12_8, xLoc, yLoc);

    } else if (timeSignature == "2/2") {
        ctx.fillText(meter2_2, xLoc, yLoc);
    } else if (timeSignature == "cut") {
        ctx.fillText(cutTime, xLoc, yLoc);
    } else if (timeSignature == "3/2") {
        ctx.fillText(meter3_2, xLoc, yLoc);
    } else if (timeSignature == "4/2") {
        ctx.fillText(meter4_2, xLoc, yLoc);
    }
}


function drawClef(clef, xLocation) {
    var msg  = "drawClef(), clef = " + clef;
//    var xLoc = xLocation ? xLocation : 20;
    var xLoc = xLocation ? xLocation : 0;
    currentLocation = xLoc;
//    console.log(msg);
    ctx.font = myTrebleClefFont;
    var yLoc = line1;  // default for treble clef MusiSync font
    var trebleClef = String.fromCharCode(71);
    var bassClef = String.fromCharCode(63);
    if (clef == "treble") {
        ctx.fillText(trebleClef, xLoc, yLoc);
        useBassClef = false;
    }
    if (clef == "bass") {
        ctx.font = myBassClefFont;
        yLoc = line2 + lineSpaceScale*1 - 2;
        ctx.fillText(bassClef, xLoc, yLoc);        
        useBassClef = true;
    }
}

function setClef(clef) {
	if (clef == "treble") {
		useBassClef = false;
	}
	if (clef == "bass") {
		useBassClef = true;
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
//    'x-downstem' : sixteenthNoteDownStem,
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
    if(useBassClef) {
        var noteLoc = BassStaffMap[note];
    } else {
        var noteLoc = TrebleStaffMap[note];
    }
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
    if (noteLoc > spaceBelowLedger2) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerBelow3-ledgerLineYOffset);
    }
    if (noteLoc > spaceBelowLedger3) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerBelow4-ledgerLineYOffset);
    }
    // add ledgerline(s) above staff if needed
    if (noteLoc < spaceAboveStaff) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerAbove1-ledgerLineYOffset);
    }
    if (noteLoc < spaceAboveLedger1) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerAbove2-ledgerLineYOffset);
    }
    if (noteLoc < spaceAboveLedger2) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerAbove3-ledgerLineYOffset);
    }
    if (noteLoc < spaceAboveLedger3) {
        ctx.fillText("_", xLoc-ledgerLineXOffset, ledgerAbove4-ledgerLineYOffset);
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


//-------------------------------------------------------
var keyNoteToNumberFlats = {
    'C': 0, 'Db': 5, 'Eb': 3, 'F': 1,
    'Ab': 4, 'Bb': 2, 'Gb': 6, 'Cb': 7
}

var keyNoteToNumberSharps = {
    'C': 0, 'C#': 7, 'D': 2, 'E': 4,
    'F#': 6, 'G': 1, 'A': 3, 'B': 5
}


function drawKeySignature(keyNote) {
    var msg  = "drawKeySignature(), keyNote = " + keyNote;
//    console.log(msg);
    ctx.font = my36Font;
    
    const chromaticSpacing = 12;
    const xLoc = 50;
    
    if(useBassClef) {
        var sharpLocations = [ line4, space2, space4, line3, space1, space3, line2 ];
        var flatLocations = [line2, space3, space1, line3, line1, space2, spaceBelowStaff]
    } else {
        var sharpLocations = [line5, space3, spaceAboveStaff, line4, space2, space4, line3];;
        var flatLocations = [line3, space4, space2, line4, line2, space3, space1]
    }

// \ = barline


    ctx.font = my36Font;
    // use keyNote to select the correct locations array 
    let useSharps = false;
    let numOfChromatics = keyNoteToNumberFlats[keyNote];
    
    if(numOfChromatics === undefined) {
        numOfChromatics = keyNoteToNumberSharps[keyNote];
        useSharps = true;
    }
    
    if(useSharps) {
        var locations = sharpLocations;
        var chromaticSign = '#';
    } else {
        var locations = flatLocations;    
        var chromaticSign = 'b';
    }
    
    for(let i=0; i<numOfChromatics; i++) {
        ctx.fillText(chromaticSign, xLoc+(chromaticSpacing*i), locations[i]-accidentalYOffset);        
    }
/*-----------------------------------------    
    // add accidentals if needed
    if (accidental == "sharp") {
        ctx.fillText("#", xLoc-accidentalXOffset, noteLoc-accidentalYOffset);
    } else if (accidental == "flat") {
        ctx.fillText("b", xLoc-accidentalXOffset, noteLoc-accidentalYOffset);    
    }     
//----------------------------------------------*/

}

//-------------------------------------------------------

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
        // in MaestroTimes doubleSharp is (aledgedly) option x
        // however each of those quoted character strings result is something else
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

//function drawScale(scaleNotes, rhythms, text) {
function drawScale(scaleNotes, rhythms) {
    chordXLocation = [];
    var msg  = "drawScale(), notes = " + scaleNotes;
//    console.log(msg);
    var i;
    for (i=0; i < scaleNotes.length; i++) {
        // skip scaleNotes[i] when it's blank
        if(scaleNotes[i] != "") {
            if(rhythms === undefined)
                drawNote((noteSpacing*(i+2)+currentLocation), scaleNotes[i]);
            else
                drawNote((noteSpacing*(i+2)+currentLocation), scaleNotes[i], rhythms[i]);
        }
        // ADJUST CODE HERE noteXLocations[note] 'note' needs to have a note number appended to it will be a unique key
        noteXLocations[scaleNotes[i]] = noteSpacing*(i+2);  
//        console.log("noteXLocations["+scaleNotes[i]+"]="+noteXLocations[scaleNotes[i]])
    }
//    currentLocation = currentLocation + (scaleNotes.length*noteSpacing);
    currentLocation = (scaleNotes.length*noteSpacing);
    
}


function drawScaleWithBeams(scaleNotes, rhythms, beam_locations) {
    chordXLocation = [];
//    var msg  = "drawScaleWithBeams(), notes = " + scaleNotes + " (eighth) beam_locations[0]="+ beam_locations[0] + ' (sixteenth) beam_locations[1]='+ beam_locations[1];
    var msg  = ["drawScaleWithBeams(), notes = ", scaleNotes, " (eighth) beam_locations[0] = ", beam_locations[0], " (sixteenth) beam_locations[1] = ", beam_locations[1]];
    console.log(msg.join(''));
    var i;
    var beam_index_8 = 0;
    var beam_index_16 = 0;
    var beam_groups_eighth = beam_locations[0];
    var beam_groups_eighth_len = beam_groups_eighth.length;
    var beam_groups_sixteenth = beam_locations[1];    
    var beam_groups_sixteenth_len = beam_groups_sixteenth.length;
    var beam_group_8;
    var beam_group_16;    
    for (i=0; i < scaleNotes.length; i++) {
        // check if this index is from a beam group
        beam_group_8 = beam_groups_eighth[beam_index_8];
        beam_group_16 = beam_groups_sixteenth[beam_index_16];
//        var msg2 = ['beam_group_8=',beam_group_8];
//        console.log(msg2.join(''))
        if(i == beam_group_8[0]) {
            console.log('i = '+i+' start eighth beam group');
            drawBeamGroup(scaleNotes, rhythms, beam_group_8);
            // look for nested sixteenth group
            if(beam_group_16[0] > beam_group_8[0] && beam_group_16[1] <= beam_group_8[1]) {
                drawBeamGroup(scaleNotes, rhythms, beam_group_16);
				if(beam_index_16 < beam_groups_sixteenth_len-1) {
					beam_index_16 = beam_index_16+1;
				}
            }
            i=beam_group_8[1];
            if(beam_index_8 < beam_groups_eighth_len-1) {
                beam_index_8 = beam_index_8+1;
            }
            continue;
        }
        if(i == beam_group_8[1]) {
            console.log('i = '+i+' end eighth beam group');
            if(beam_index_8 < beam_groups_eighth_len-1) {
                beam_index_8 = beam_index_8+1;
            }
        }
        if(i == beam_group_16[0]) {
            console.log('i = '+i+' start sixteenth beam group');
            drawBeamGroup(scaleNotes, rhythms, beam_group_16);
            i=beam_group_16[1];
            if(beam_index_16 < beam_groups_sixteenth_len-1) {
                beam_index_16 = beam_index_16+1;
            }
            continue;
        }
        if(i == beam_group_16[1]) {
            console.log('i = '+i+' end sixteenth beam group');
            if(beam_index_16 < beam_groups_sixteenth_len-1) {
                beam_index_16 = beam_index_16+1;
            }
        }

        // skip scaleNotes[i] when it's blank
        if(scaleNotes[i] != "") {
            if(rhythms === undefined)
                drawNote((noteSpacing*(i+2)+currentLocation), scaleNotes[i]);
            else
                drawNote((noteSpacing*(i+2)+currentLocation), scaleNotes[i], rhythms[i]);
        }
        // ADJUST CODE HERE noteXLocations[note] 'note' needs to have a note number appended to it will be a unique key
        noteXLocations[scaleNotes[i]] = noteSpacing*(i+2)+currentLocation;  
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
//    var noteSpacing = 50;
    for (i=0; i < chordNotes.length; i++) {
        drawChordNote(xLoc, chordNotes[i]);
    }
}


//function drawChordProgression(chordProgression, duration) {
function drawChordProgression(chordProgression) {
    var msg  = "drawChordProgression(), chordProgression = " + chordProgression;
//    console.log(msg);
//    var noteSpacing = 50;
    var chordNotes;
    for(let j=0; j<chordProgression.length; j++) {
        chordNotes = chordProgression[j];
        for (let i=0; i < chordNotes.length; i++) {
            drawChordNote((noteSpacing*2)*(j+1), chordNotes[i]);
//            drawChordNote(ctx, (noteSpacing*2)*(j+1), chordNotes[i]);
        }
    }
}

function setNoteSpacing(spacing) {
    noteSpacing = (spacing > 80)? 80: spacing;
}

function getNoteSpacing(spacing) {
    return noteSpacing;
}

var MIDI_SHARP_NAMES = ['B#_0',  'C#_1', 'Cx_1', 'D#_1',   'E_1',  'E#_1',  'F#_1', 'Fx_1',  'G#_1', 'Gx_1', 'A#_1', 'B_1',
                    'B#_1', 'C#0', 'Cx0', 'D#0', 'E0', 'E#0', 'F#0', 'Fx0', 'G#0', 'Gx0', 'A#0', 'B0',
                    'B#0', 'C#1', 'Cx1', 'D#1', 'E1', 'E#1', 'F#1', 'Fx1', 'G#1', 'Gx1', 'A#1', 'B1',
                    'B#1', 'C#2', 'Cx2', 'D#2', 'E2', 'E#2', 'F#2', 'Fx2', 'G#2', 'Gx2', 'A#2', 'B2',
                    'B#2', 'C#3', 'Cx3', 'D#3', 'E3', 'E#3', 'F#3', 'Fx3', 'G#3', 'Gx3', 'A#3', 'B3',
                    'B#3', 'C#4', 'Cx4', 'D#4', 'E4', 'E#4', 'F#4', 'Fx4', 'G#4', 'Gx4', 'A#4', 'B4',
                    'B#4', 'C#5', 'Cx5', 'D#5', 'E5', 'E#5', 'F#5', 'Fx5', 'G#5', 'Gx5', 'A#5', 'B5',
                    'B#5', 'C#6', 'Cx6', 'D#6', 'E6', 'E#6', 'F#6', 'Fx6', 'G#6', 'Gx6', 'A#6', 'B6',
                    'B#6', 'C#7', 'Cx7', 'D#7', 'E7', 'E#7', 'F#7', 'Fx7', 'G#7', 'Gx7', 'A#7', 'B7',
                    'B#7', 'C#8', 'Cx8', 'D#8', 'E8', 'E#8', 'F#8', 'Fx8', 'G#8', 'Gx8', 'A#8', 'B8',
                    'B#8', 'C#9', 'Cx9', 'D#9', 'E9', 'E#9', 'F#9', 'Fx9'];
                          

var MIDI_FLAT_NAMES = ['C_1', 'Db_1', 'D_1', 'Eb_1', 'Fb_1', 'F_1', 'Gb_1', 'G_1', 'Ab_1', 'A_1', 'Bb_1', 'Cb0',
                    'C0', 'Db0', 'D0', 'Eb0', 'Fb0', 'F0', 'Gb0', 'G0', 'Ab0', 'A0', 'Bb0', 'Cb1',
                    'C1', 'Db1', 'D1', 'Eb1', 'Fb1', 'F1', 'Gb1', 'G1', 'Ab1', 'A1', 'Bb1', 'Cb2',
                    'C2', 'Db2', 'D2', 'Eb2', 'Fb2', 'F2', 'Gb2', 'G2', 'Ab2', 'A2', 'Bb2', 'Cb3',
                    'C3', 'Db3', 'D3', 'Eb3', 'Fb3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'Cb4',
                    'C4', 'Db4', 'D4', 'Eb4', 'Fb4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'Cb5',
                    'C5', 'Db5', 'D5', 'Eb5', 'Fb5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'Cb6',
                    'C6', 'Db6', 'D6', 'Eb6', 'Fb6', 'F6', 'Gb6', 'G6', 'Ab6', 'A6', 'Bb6', 'Cb7',
                    'C7', 'Db7', 'D7', 'Eb7', 'Fb7', 'F7', 'Gb7', 'G7', 'Ab7', 'A7', 'Bb7', 'Cb8',
                    'C8', 'Db8', 'D8', 'Eb8', 'Fb8', 'F8', 'Gb8', 'G8', 'Ab8', 'A8', 'Bb8', 'Cb9',
                    'C9', 'Db9', 'D9', 'Eb9', 'Fb9', 'F9', 'Gb9', 'G9'];
                    


var MIDI_OTHER_NAMES = ['Dbb_1', 'Bx_0', 'Ebb_1', 'Fbb_1', 'Dx_1', 'Gbb_1', 'Ex_1', 'Abb_1', 'Ab_1', 'Bbb_1', 'Cbb0', 'Ax_1',
                    'Dbb0', 'Bx_1', 'Ebb0', 'Fbb0', 'Dx0', 'Gbb0', 'Ex0', 'Abb0', 'Ab0', 'Bbb0', 'Cbb1', 'Ax0',
                    'Dbb1', 'Bx0', 'Ebb1', 'Fbb1', 'Dx1', 'Gbb1', 'Ex1', 'Abb1', 'Ab1', 'Bbb1', 'Cbb2', 'Ax1',
                    'Dbb2', 'Bx1', 'Ebb2', 'Fbb2', 'Dx2', 'Gbb2', 'Ex2', 'Abb2', 'Ab2', 'Bbb2', 'Cbb3', 'Ax2',
                    'Dbb3', 'Bx2', 'Ebb3', 'Fbb3', 'Dx3', 'Gbb3', 'Ex3', 'Abb3', 'Ab3', 'Bbb3', 'Cbb4', 'Ax3',
                    'Dbb4', 'Bx3', 'Ebb4', 'Fbb4', 'Dx4', 'Gbb4', 'Ex4', 'Abb4', 'Ab4', 'Bbb4', 'Cbb5', 'Ax4',
                    'Dbb5', 'Bx4', 'Ebb5', 'Fbb5', 'Dx5', 'Gbb5', 'Ex5', 'Abb5', 'Ab5', 'Bbb5', 'Cbb6', 'Ax5',
                    'Dbb6', 'Bx5', 'Ebb6', 'Fbb6', 'Dx6', 'Gbb6', 'Ex6', 'Abb6', 'Ab6', 'Bbb6', 'Cbb7', 'Ax6',
                    'Dbb7', 'Bx6', 'Ebb7', 'Fbb7', 'Dx7', 'Gbb7', 'Ex7', 'Abb7', 'Ab7', 'Bbb7', 'Cbb8', 'Ax7',
                    'Dbb8', 'Bx7', 'Ebb8', 'Fbb8', 'Dx8', 'Gbb8', 'Ex8', 'Abb8', 'Ab8', 'Bbb8', 'Cbb9', 'Ax8',
                    'Dbb9', 'Bx8', 'Ebb9', 'Fbb9', 'Dx9', 'Gbb9', 'Ex9', 'Abb9'];
                    

function noteNameToMIDI(noteName)  {
    var i;
    var MIDInumber = -1; // default if not found
    for(i=0; i < MIDI_SHARP_NAMES.length; i++) {
        if( noteName == MIDI_SHARP_NAMES[i] ||
                noteName == MIDI_FLAT_NAMES[i] ||
                    noteName == MIDI_OTHER_NAMES[i] ) {
        
            MIDInumber = i;  // found it
        }
    }
    return MIDInumber;
}

function shiftOctave(arr, octaveChange) {
    // check for valid octaveChange range of -3 to 3
    let temp;
    const newArray = arr.forEach(item => {
        temp = item.slice(0,item.length-1);
        let octave = Number(item.slice(item.length-1));
        temp += "" + (octave + octaveChange); 
        console.log(`temp = ${temp} octave = ${octave}`);
    })
}



	return {
		drawClef: drawClef,
		setClef: setClef,
//		drawStaff: drawStaff,
        drawText: drawText,
        drawTheStaff: drawTheStaff,
		drawKeySignature: drawKeySignature,
		drawTimeSignature: drawTimeSignature,
		drawBarline: drawBarline,
		currentLocation: currentLocation,
		drawChordNote: drawChordNote,
		drawColoredNote: drawColoredNote,
		drawTheColoredNote: drawTheColoredNote,
		drawNote: drawNote,
		clearCanvas: clearCanvas,
		drawScale: drawScale,
		drawScaleWithBeams: drawScaleWithBeams,
		drawChord: drawChord,
		drawChordProgression: drawChordProgression,
		clearLastAnimatedNote: clearLastAnimatedNote,
		setNoteSpacing: setNoteSpacing,
		getNoteSpacing: getNoteSpacing,
		calcBeamLocations: calcBeamLocations
	};

}
