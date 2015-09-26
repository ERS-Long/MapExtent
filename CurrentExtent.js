define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/Button',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom', 
    'dojo/domReady!',
    'dojo/aspect',
    'dojo/on',
    'dojo/text!./CurrentExtent/templates/CurrentExtent.html',
    'dojo/topic',
    'xstyle/css!./CurrentExtent/css/CurrentExtent.css',
    'dojo/dom-construct',
    'dojo/_base/Color',
    'esri/geometry/webMercatorUtils',
    'esri/toolbars/draw',
    'esri/graphic',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/Color'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Button, lang, arrayUtils, dom, ready, aspect, on, template, topic, css, domConstruct, Color1, webMercatorUtils, Draw, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color) {
    var drawExtentOn;
    var map;
    var clickmode;
    var drawToolbar;
    var theGeometry;

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        name: 'CurrentExtent',
        map: true,
        widgetsInTemplate: true,
        templateString: template,
        mapClickMode: null,

        postCreate: function(){
            drawExtentOn = 0;
            this.inherited(arguments);
            map = this.map;
            drawToolbar= new Draw(this.map);
            drawToolbar.on("draw-end", lang.hitch(this, 'addToMap'));
            this.own(topic.subscribe("mapClickMode/currentSet", lang.hitch(this, "setMapClickMode")));

            if (this.parentWidget) {
                if (this.parentWidget.toggleable) {
                    this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
                        this.onLayoutChange(this.parentWidget.open);
                    })));
                }
            }

            map.on('mouse-drag, extent-change', lang.hitch(this, 'onExtent'));

        },

        onLayoutChange: function (open) {
          if (open) {
            //this.onOpen();
          } else {
            this.onClear();
          }

         open || "draw" === this.mapClickMode && topic.publish("mapClickMode/setDefault")

        },

        disconnectMapClick: function() {
            topic.publish("mapClickMode/setCurrent", "draw");
        },

        connectMapClick: function() {
            topic.publish("mapClickMode/setDefault");
        },

        addToMap: function (evt) {
            drawExtentOn = 1;
            var symbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID, 
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), 
                new Color([255, 255, 0, 0.25])
                );

            var graphic = new Graphic(evt.geometry, symbol);
            map.graphics.add(graphic);
            theGeometry = evt.geometry;
            this.getTheExtent(theGeometry);
            this.connectMapClick();
            drawToolbar.deactivate();
            map.setMapCursor("default");
        },

        getTheExtent: function(geometry)
        {
            var s = "";
            
            s += "xmin: " + geometry.xmin.toFixed(9) + ", \n"
                +"ymin: " + geometry.ymin.toFixed(9) + ", \n"
                +"xmax: " + geometry.xmax.toFixed(9) + ", \n"
                +"ymax: " + geometry.ymax.toFixed(9) + ", \n"
                +"\n"
                +"spatialReference:{ \n"
                +"    wkid:102100 \n"
                +"} \n";
            
            s += "\n";

            var normalizedValMin = webMercatorUtils.xyToLngLat(geometry.xmin, geometry.ymin);
            var normalizedValMax = webMercatorUtils.xyToLngLat(geometry.xmax, geometry.ymax);

            s += "xmin: " + normalizedValMin[0].toFixed(6) + ", \n"
                +"ymin: " + normalizedValMin[1].toFixed(6) + ", \n"
                +"xmax: " + normalizedValMax[0].toFixed(6) + ", \n"
                +"ymax: " + normalizedValMax[1].toFixed(6) + ", \n"
                +"\n"
                +"spatialReference:{ \n"
                +"    wkid:4326 \n"
                +"} \n";

            s += "\n";

            var xcenter1 = (parseFloat(normalizedValMin[0]) + parseFloat(normalizedValMax[0]))/2.0;
            var ycenter1 = (parseFloat(normalizedValMin[1]) + parseFloat(normalizedValMax[1]))/2.0;

            s += "center: [" + xcenter1.toFixed(6) + ", " + ycenter1.toFixed(6) + "], \n";

            var level = map.getLevel();
            s += "zoom: " + level + ", \n";
            s += "\n";

            s += "\n";

            document.getElementById('currentExtent').value = s;
        },

        onExtent: function()
        {
            if (drawExtentOn === 0)
            {
                this.getTheExtent(map.extent);
            }
            else if (drawExtentOn === 1)
            {
                this.getTheExtent(theGeometry);
            }
        },

        onDrawExtent: function()
        {
            this.disconnectMapClick();
            this.onClear();

            drawToolbar.activate(Draw.EXTENT);
            this.map.setMapCursor('crosshair');
        },

        onClear: function()
        {
            drawExtentOn = 0;
            document.getElementById('currentExtent').value = "";
            this.map.graphics.clear();
            this.connectMapClick();
            drawToolbar.deactivate();
            map.setMapCursor("default");
            theGeometry = null;
        },

        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
        }
    });
});
