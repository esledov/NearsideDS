function NearsideApplication() {
    
    var self = this;
    
    //Lock screen orientation to Landscape.
    app.SetOrientation( "Landscape" );

    //Read configuration from json file
    var txt = app.ReadFile("Config.json");
    self.config = JSON.parse(txt);

	//Create the main app layout
    self.lay = app.CreateLayout("Linear","Horizontal,Right,FillXY");

    //Create a main text area and add it to the layout.
    var width = 1 - self.config["toolbar-width"];
    self.txt = app.CreateText("", width , 1.0 , "Multiline,Left");
    self.txt.SetTextSize(32);
    self.txt.SetPadding(0.05, 0.05, 0.05, 0.05);
    self.lay.AddChild(self.txt);

    // Initialize Controller
    self.c = new Controller(self);
    self.txt.SetOnTouch(self.c.clicked_on_text);
    
    // Create Toolbar component
    self.toolbar = new Toolbar(self);
    
    //Add layout to app.    
    app.AddLayout( self.lay );
}