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

