
    var stability = {

         line  : null,
         gantt : null,
         gauge : null,
         bar   : null,

     /* Init function  */
         init: function() 
         {

          $(window).bind('resize', function ()
            {       
                ISEUtils.resizeGraphs(stability.line);
                ISEUtils.resizeGraphs(stability.gantt);
                ISEUtils.resizeGraphs(stability.gauge);
                ISEUtils.resizeGraphs(stability.bar);
             });   
      

            stability.setInitialDimensions();     
            stability.drawRGraphs();

         },
     
     setInitialDimensions: function()
     {
           
            stability.setGraphDimenstions('stability_cvs');
            stability.setGraphDimenstions('stability_cvs1');
            stability.setGraphDimenstions('stability_cvs2');
            stability.setGraphDimenstions('stability_cvs3');

     }, 


  setGraphDimenstions : function(canvasID)
     {
        var c = $('#'+canvasID);
            var ct = c.get(0).getContext('2d');
            var container = $(c).parent();

            c.attr('width', $(container).width() ); //max width
            c.attr('height', $(container).height() ); //max height

     },

        /* Generate R-Graphs   */
         drawRGraphs: function()
           {

           stability.line= new RGraph.Line({
                        id: 'stability_cvs',
                        data: [5,4,1,6,8,5,3],
                        options: {
                            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
                      
                             
                               
                            
                        }
                    }).draw();

                    var data = [
                        [31, 28, 67, 'Richard'], [0, 28, 50, 'Rachel'], [12, 28, 45, 'Fred'],
                        [59, 14, 0, 'Barney'],   [59, 21, 5, 'Gloria'], [46, 31, 92, 'Paul'],
                        [80, 21, 46, 'Harry'],   [94, 17, 84, 'Shane'], [34, 14, 32, 'Kyle'],
                        [64, 14, 28, 'Cynthia'], [13, 61, 74, 'Mabel'], [84, 31, 16, 'Paul'],
                        [80, 22, 45, 'Kiffen'], [0, 115, 50, 'John']
                    ];


            stability.gantt = new RGraph.Gantt({
                        id: 'stability_cvs1',
                        data: data,
                        options: {
                            labels: ['January', 'February', 'March', 'April'],
                            xmax: 122,
                            'labels.percent': true
                        }
                    }).draw();


            stability.gauge = new RGraph.Gauge({
                        id: 'stability_cvs2',
                        min: 0,
                        max: 10,
                        value: 3.2
                    }).draw();

                    var ca = document.getElementById("stability_cvs3");
                    var data           = [15,14,12,18,16,13];
                    var data_drilldown = [];

                    /**
                    * The drilldown data - the order corresponds to that of the labels
                    */
                    data_drilldown.push([2,3,1,2,3,1,3]);
                    data_drilldown.push([2,2,2,1,2,2,3]);
                    data_drilldown.push([1,1,1,2,3,2,2]);
                    data_drilldown.push([3,3,3,2,3,3,1]);
                    data_drilldown.push([4,3,1,1,3,2,2]);
                    data_drilldown.push([3,2,2,2,3,1,0]);

                    var labels = ['John','Fred','Luis','Kevin','Lola','June']

                    var bar = drawMainChart();
                    
                    /**
                    * Draws the main chart
                    */
                    function drawMainChart ()
                    {
                        RGraph.reset(ca);

                         stability.bar = new RGraph.Bar({
                            id: 'stability_cvs3',
                            data: data,
                            options: {
                                labels: labels,
                                bevel: !RGraph.ISOLD,                              
                                background: {
                                    grid: {
                                        autofit: {
                                            numvlines: data.length
                                        }
                                    }
                                },
                                strokestyle:'rgba(0,0,0,0)'
                            }
                        }).fadeIn();       
                  
                    }
                    
                    document.getElementById("butBack").onclick = function (e)
                    {
                        var obj = ca.__object__;

                        obj.fadeOut(null,function ()
                        {
                            var bar = drawMainChart();
                        });
                    }
           },

         
 

  onFullscreen : function (graphObj)
  {
     
    window.setTimeout(function() { ISEUtils.fullscreenResizeGraphs(graphObj);}, 10);
  }

};
    