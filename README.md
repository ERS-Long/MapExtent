# MapExtent
CMV Widget to get map extent and zoom level

This widget can be utilized to get current map extent or draw an map extent. It returns both the map extent, center point, and zoom in level.
The value should refresh if the map extent changes.

Viewer.js config setting

            currentExtent: {
                include: true,
                id: 'currentExtent',
                type: 'titlePane',
                canFloat: true,
                path: 'widgets/CurrentExtent',
                title: '<i class="icon-large icon-road"></i>&nbsp;&nbsp;Get Current Extent',
                position: 13,
                options: {
                    map: true
                }
            },            


Example Draw Extent Return

            xmin: -11594594.709399065, 
            ymin: 3578662.282692148, 
            xmax: -10305560.664398193, 
            ymax: 4224402.297645146, 
            
            spatialReference:{ 
                wkid:102100 
            } 
            
            xmin: -104.156016, 
            ymin: 30.582621, 
            xmax: -92.576427, 
            ymax: 35.444135, 
            
            spatialReference:{ 
                wkid:4326 
            } 
            
            center: [-98.366221, 33.013378], 
            zoom: 6, 
