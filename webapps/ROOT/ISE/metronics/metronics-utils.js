/*-------------------------------------------------------------------------
 * CORE PLUGINS 
 *
 *-------------------------------------------------------------------------*/

var MetronicUtils = {


    /* // CSS Plug-ins
        metronics_Css_Plugins_Path: "metronics/global/plugins/",

        // Global Mandatory Styles
        arr_Metronics_Mandatory_Plugins: ['font-awesome/css/font-awesome.min.css',
            'simple-line-icons/simple-line-icons.min.css',
            'bootstrap/css/bootstrap.min.css',
            'uniform/css/uniform.default.css',
            'bootstrap-switch/css/bootstrap-switch.min.css'
        ],

        //Theme Styles

        metronics_Theme_Plugins_Path: "metronics/global/css/",

        arr_Metronics_Theme_Plugins: ['components.css',
            'components-rounded.css', 'plugins.css'
        ],


        // Layout/Component Styles

        metronics_Layout_Plugins_Path: "metronics/admin/layout/css/",

        arr_Metronics_Layout_Plugins: ['layout.css',
            'themes/default.css', 'themes/grey.css', 'custom.css'
        ],
        */

    // Plug-ins Path

    jquery_Plugins_Path: "metronics/global/plugins/",
    metronics_Scripts_Path: "metronics/global/scripts/",
    layout_Scripts_Path: "metronics/admin/layout2/scripts/",
    

    arr_JqueryScripts: ['jquery-migrate.min.js',
        'bootstrap/js/bootstrap.min.js',
        'jquery.blockui.min.js',
        'uniform/jquery.uniform.min.js',
        'jquery.cokie.min.js', 'moment.min.js','jquery.mockjax.js',
        'jquery-validation/js/jquery.validate.min.js',
        'jquery-ui/jquery-ui.min.js',
        'bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
        'jquery-slimscroll/jquery.slimscroll.min.js',
        'bootstrap-switch/js/bootstrap-switch.min.js',
        'jstree/dist/jstree.min.js',
        'underscore-min.js','bootstrap-wysihtml5/wysihtml5-0.3.0.js',
        'bootstrap-wysihtml5/bootstrap-wysihtml5.js',
        'bootstrap-datepicker/js/bootstrap-datepicker.min.js',       
        'bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',  
        'bootstrap-editable/bootstrap-editable/js/bootstrap-editable.js',
        'jstree/dist/jstreegrid.js'
        
    ],

    arr_MetronicScripts: ['metronic.js','datatable.js'],
    arr_LayoutScripts: ['layout.js'],

   

   
    /**
     * @initilize function
     */
    loadPlugins: function(callBackFunction) {


        //  Load Metronic Css Styles
        //MetronicUtils.loadCss(MetronicUtils.metronics_Css_Plugins_Path, MetronicUtils.arr_Metronics_Mandatory_Plugins, function() {

        // MetronicUtils.loadCss(MetronicUtils.metronics_Theme_Plugins_Path, MetronicUtils.arr_Metronics_Theme_Plugins, function() {

        //   MetronicUtils.loadCss(MetronicUtils.metronics_Layout_Plugins_Path, MetronicUtils.arr_Metronics_Layout_Plugins, function() {

        // });
        // });
        // });

        // Load Jquery plug-ins
        MetronicUtils.loadScripts(MetronicUtils.jquery_Plugins_Path, MetronicUtils.arr_JqueryScripts, function() {
            // Load Metronic plug-ins
            MetronicUtils.loadScripts(MetronicUtils.metronics_Scripts_Path, MetronicUtils.arr_MetronicScripts, function() {
                // Load Layout plug-ins
                MetronicUtils.loadScripts(MetronicUtils.layout_Scripts_Path, MetronicUtils.arr_LayoutScripts, function() {
                      
                         callBackFunction();               

                });

            });

        });
		
		  
    },

    /**
     * To Load the all the scripts file
     * @loadScripts function
     * @param {string} scripts - path.
     * @param {function} callback - callback function.
     */
    loadScripts: function(path, scripts, callback) {

        var scripts = scripts || new Array();
        var callback = callback || function() {};

        var deferreds = [];
            $.each(scripts, function(index){
                deferreds.push(
                 
                   $.ajax({
                       url: path + scripts[index] + "?v=" + localStorage.mVersion,
					   cache: true, 
                      dataType: "script",
                      async: true
                    })
					
                );
            });
         
            $.when.apply($, deferreds).then(function(){                
                  callback();
                
            }) .fail(function(){
                console.log("failure");
				callback();
            })        
    },

};
