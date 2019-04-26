# musicNotationCanvas
simple music notation drawing with animation

fonts loaded via css

    @font-face {
        font-family: MusiSync;
        src: local(MusiSync), url('https://www.guitarland.com/fonts/MusiSync.ttf') format('opentype');
    }
    @font-face {
        font-family: Maestro;
        src: local(Maestro), url('https://www.guitarland.com/fonts/Maestro.ttf') format('opentype');
    }
    @font-face {
        font-family: MaestroTimes;
        src: local(Maestro), url('https://www.guitarland.com/fonts/MaestroTimes.ttf') format('opentype');
    }

Currently moving away from using fonts for notes so that eventually beaming can be used.  Fonts are used for Treble and Bass Clefs, sharp and flat symbols.