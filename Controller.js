function Controller(application) {

    var self = this;
    self.a = application;
    
    /* Return name text or mp3 file for current card like 005.txt */
    self.get_fname = function(ext) {
        var s = "00" + self.card_id;
        var zfilled = s.substr(s.length - 3);
        return self.data_dir + "/" + self.project + "/" + zfilled + ext;
    };  

    /* Show current card */
    self.show_card = function() {        
        var fname = self.get_fname(".txt");
        self.a.txt.SetText(app.ReadFile(fname));
        self.play_sound(false);
    };

    /* Show next card */
    self.show_next = function() {
    
        self.card_id += 1;
        var fname = self.get_fname(".txt");

        if (!app.FileExists(fname)){

            // exit macro mode if we reached the end
            if (self.mode == "Macro")
                self.toggle_macro();

            self.card_id -= 1;
            return;
        }
        
        self.show_card(self.card_id);
    };

    /* Show previous card */
    self.show_previous = function() {
    
        if (self.mode != "Browse") return;
        if (self.card_id == 1) return; 
        
        self.card_id -= 1;
        self.show_card(self.card_id);
    };


    self.play_sound = function(force) {

        if (self.mute_on && !force) return;

        var fname = self.get_fname(".mp3");
        self.player.SetFile(fname);

    };

    /* 
        If user clicks on left side of text - show previous card
        If user clicks on the right side of the text - show next one 
    */
    self.clicked_on_text = function(ev) {

        if (ev.action != "Down") return; 
        if (self.mode != "Browse") return;        
            
        if (ev.X < 0.2) {
            self.show_previous();
            return;
        }
        
        if (ev.X > 0.8) {
            self.show_next();
            return;
        }
        
    };

    /*
        Toggle mute status,
        Set different button icon
    */
    this.toggle_mute = function(){

        if (self.mode != "Browse") return;        

        self.mute_on = !self.mute_on;
        var icn = self.mute_on ? "[fa-bell-slash]" : "[fa-music]";
        var btn = self.a.toolbar.btnToggleMute;
        btn.SetText(icn);
    };

    /* 
        Toggle between Macro and Browse mode,
        Start / turn off Macro playing
    */
    this.toggle_macro = function(){

        var btn = self.a.toolbar.btnMacro;
        
        if (self.mode == "Browse"){
            self.mode = "Macro";
            btn.SetTextColor(TOOLBAR_CLR_ACTIVE);
            self.show_next();
        } else {
            self.mode = "Browse";
            btn.SetTextColor(TOOLBAR_CLR);
        }
    }

    /* When in macro mode, play next card after a pause */
    this.play_complete = function() {

        if (self.mode != "Macro") return;
        
        var interval = 5000;  // 5 seconds by default

        if (self.play_started) {
            var t = new Date().getTime();
            interval = 1.1 * (t - self.play_started);
            setTimeout(self.show_next, interval);
            self.play_started = 0;
        } 

    }

    /* Show open project dialog */
    self.show_open_dlg = function(){

        if (self.mode != "Browse") return;        

        dlgOpen = app.CreateDialog("Open project");
        
        lay = app.CreateLayout("Linear", "Vertical,FillXY,Left");
        lay.SetPadding(0.02, 0.02, 0.02, 0.02);
        dlgOpen.AddLayout(lay);
        
        var options = app.ListFolder(self.data_dir);
        options.sort()
        lst = app.CreateList(options, 0.5, 0.5);
        lst.SetTextSize(22);
        lst.SetOnTouch( function(name) {
            dlgOpen.Hide();
            self.project = name;
            self.card_id = 1;
            self.show_card();    
        } );
        lay.AddChild(lst);
        
        // Show dialog
        dlgOpen.Show();
        
    }
    
    /* Called when player has loaded the file and is ready to play */
    self.player_ready = function() {
        self.play_started = new Date().getTime();
        self.player.Play();
    }


    self.mode = "Browse";
    self.card_id = 1;

    // read some properties from app config
    self.project = self.a.config["project"];
    self.mute_on = self.a.config["mute-on-start"];
    self.data_dir = self.a.config["data-dir"];
    
    //Create media player.
    self.player = app.CreateMediaPlayer();
    self.player.SetOnComplete(self.play_complete);
    self.player.SetOnReady(self.player_ready);

    self.play_started = 0;
    
    self.show_card();

}