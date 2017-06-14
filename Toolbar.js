var TOOLBAR_BG = "#212121";
var TOOLBAR_CLR = "#777777";
var TOOLBAR_CLR_ACTIVE = "#cccccc";

function Toolbar(application) {

    var self = this;
    self.a = application;
    self.c = self.a.c; //Controller

    // read num_buttons from the app config
    var num_buttons = self.a.config["toolbar-num-buttons"];

    /* Adds button to the Toolbar, returns newly added button */
    this.add_button = function(icon, callback) {
        var btn = app.CreateButton("[fa-" + icon + "]",
                        self.width, self.btn_height, 
                        "Custom,FontAwesome"); 
        btn.SetStyle( TOOLBAR_BG, TOOLBAR_BG, 0,0,0,0 );
        btn.SetTextSize( self.a.config["toolbar-font-size"] );
        btn.SetTextColor( TOOLBAR_CLR );
        btn.SetOnTouch( callback );
        self.lay.AddChild( btn );
        return btn;
    };
    
    self.width = self.a.config["toolbar-width"];
    self.btn_height = 0.95 / num_buttons;
       
    //Create vertical layout
    self.lay = app.CreateLayout( "Linear", "Vertical,FillY" );
    self.lay.SetBackColor( TOOLBAR_BG );
    self.lay.SetPadding(0,0.025,0,0.025);
    self.a.lay.AddChild( self.lay);
    
    self.add_button("folder-open",self.c.show_open_dlg);
    self.add_button("step-backward", function() {self.c.card_id=1;self.c.show_card();});
    self.add_button("play", function() { self.c.play_sound(true); });
    var icn = self.c.mute_on ? "bell-slash" : "music";
    self.btnToggleMute = self.add_button(icn, self.c.toggle_mute);
    self.btnMacro = self.add_button("rocket", self.c.toggle_macro);
    
    // 5 buttons fit to small phone screens comfortably
    if (num_buttons > 5) {
        self.add_button("window-close", app.Exit);
    }

}