
 var defects = {

      /* Init function  */
      init: function()
      {

        console.log("defect init()");

        $("#textDefectSearch").on("keyup", function() {
                var value = $(this).val();

                 // Hide the table row based on search input
                $("table tr").each(function(index) {
                    if (index !== 0) {

                        $row = $(this);

                        var id = $row.find("td:first").text();

                        if (id.indexOf(value) !== 0) {
                            $row.hide();
                        }
                        else {
                            $row.show();
                        }
                    }
                });
            });  
    }
  };
