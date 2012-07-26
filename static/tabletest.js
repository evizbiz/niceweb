//my file
Ext.Loader.setConfig({
    enabled: true
});

//Ext.Loader.setPath('Ext.ux', '/static/ext/examples/ux');

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.ux.RowExpander'
]);

Ext.onReady(function () {
    /* FILE ASSOCIATIONS TABLE, Andrew Tracer, 6/8/2011

     Field:
     -filename, the name of the file
     - accepts any string
     -filetype, the type of file (e.g., measurement or background)
     - combobox options MEA or BAC
     -group, associating a bunch of files (e.g., measurement and
     background from one experiment)
     - accepts lone integers and comma separated integers

     Editing:
     -Double-click on a cell to edit an individual record's field values.
     -Shift + right-click will allow you to edit the filetype and group of all selected rows.
     -the group field will accept a single integer or a list of integers.
     The latter option is to allow association of a single file
     with multiple groups

     */

    //var GridSpace = GridSpace || {};

    Ext.namespace('GridSpace','ConfigSpace');

    ConfigSpace.root = 'http://' + window.location.hostname + ':8001/' + ConfigSpace.instrument;
    GridSpace.device = new io.connect(ConfigSpace.root + '/device');
    GridSpace.control = new io.connect(ConfigSpace.root + '/control');
    ConfigSpace.events = new io.connect(ConfigSpace.root + '/events');
    GridSpace.dataArray = [];
    GridSpace.deviceNames = [];

    Ext.regModel('deviceModel', {
        fields:[ 'id', 'label', 'position', 'target', 'device' ]
    });

    if(Ext.isSafari){
        Ext.override(Ext.grid.GridView, {
            layout : function(){
                this.scroller.dom.style.position = 'static';
            }
        });
    }

    GridSpace.store = Ext.create('Ext.data.Store', { model:'deviceModel'});

    GridSpace.gridColumns = [];

    GridSpace.gridColumns.push({header:'device', width:150, sortable:true, dataIndex:'label'});
    GridSpace.gridColumns.push({header:'position', width:150, hidden:false, sortable:true, dataIndex:'position'});
    GridSpace.gridColumns.push({header:'target', width:150, hidden:false, sortable:true, dataIndex:'target'});

    GridSpace.tpl =
        ['<tpl for ="device.visibleNodeIDs">',
            '<p><b>{[this.getName(values, parent)]}: </b>{[this.getVal(values, parent)]}</p>',
//        '<p><b>{parent.device.nodes[values].nodeID}</b></p>',
        {getName: getName,
        getVal: getVal},
            '</tpl>'];
//        ['<tpl for="device.nodes">',
//            '<p><b>{#}:</b></p>',  //{currentValue.val}</p>',
//            '</tpl>'];
    function getName(values, parent) {
        return parent.device.nodes[values].nodeID;
    }

    function getVal(values, parent) {
        return parent.device.nodes[values].currentValue.val;
    }
//    tpl.overwrite(panel.body, data.kids);
//        this.rowExpander = new Ext.ux.RowExpander({
//            rowBodyTpl: GridSpace.tpl,
//        renderer: function(p, record) {
//            if (record.get('listeRetourChaqueJour') != "") {
//                p.cellAttr = 'rowspan="2"';
//                return '<div class="x-grid3-row-expander"></div>';
//            } else {
//                p.id = '';
//                return '&#160;';
//            },
//        expandOnEnter: false,
//        expandOnDblClick: false
//    });
    //field: {xtype: 'numberfield', allowBlank: false}});
    /*GridPanel that displays the data*/
    GridSpace.grid = new Ext.grid.GridPanel({
        store: GridSpace.store,
        columns: GridSpace.gridColumns,
        stripeRows:true,
        height:500,
        width:475,
        listeners: {
            itemclick: function(view, cell, rowIdx, cellIndex, e) {

                this.plugins[0].toggleRow(rowIdx);
            }
        },
        //if other plugins are added, check listener (this.plugins[0]) and make sure
        //that the 0 index plugin is still rowexpander
//        plugins: [rowExpander],
          plugins:
            [{ptype: 'rowexpander',
            rowBodyTpl : GridSpace.tpl
            //renderer: render(p, record)
        }],
        title:'Devices',
        collapsible: true,
        animCollapse: false
    });


    GridSpace.device.on('connect', function () {
        console.log("device connect");
        GridSpace.device.emit('subscribe', GridSpace.setDeviceModel);
    });

    GridSpace.device.on('reset', GridSpace.setDeviceModel);

    GridSpace.device.on('changed', function (nodes) {
        for (var i=0; i < nodes.length; i++) {
            var node = nodes[i];
            var deviceRecord = GridSpace.grid.store.findRecord('id', node.deviceID);
            if (deviceRecord !== null) {
                deviceRecord.data.device.nodes[node.nodeID] = node;
                if (deviceRecord.data.device.primaryNodeID === node.nodeID) {
                    GridSpace.setDeviceValue(deviceRecord.data);
                    deviceRecord.commit();
                }
            }
        }
        // GridSpace.grid.getView().refresh();
    });

    GridSpace.setDeviceModel = function (data) {
        console.log("device subscribe", data);
        GridSpace.dataArray = [];
        // TODO: change this to the device display heirarchy when it is available
        var deviceIDs = GridSpace.sorted_keys(data);
        for (var i = 0; i < deviceIDs.length; i++) {
            var device = data[deviceIDs[i]];
            var datum = {
                 id: device.id,
                 label: device.displayName,
                 position: '',
                 target: '',
                 device: device
            };
            if (device.type === "LOGICAL_COUNTER") {
                continue;
            }
            GridSpace.setDeviceValue(datum);
            GridSpace.dataArray.push(datum);
        }

        GridSpace.grid.store.loadData(GridSpace.dataArray);
        GridSpace.grid.getView().refresh();
    };


    GridSpace.setDeviceValue = function (record) {
        if (record.device.primaryNodeID === "") return;
        var node = record.device.nodes[record.device.primaryNodeID];
        record.position = GridSpace.trimmedValue(node.currentValue);  
        if (record.device.type === "MOTOR") {
            record.target = GridSpace.trimmedValue(node.desiredValue);
        }
    } 

    GridSpace.trimmedValue = function (value) {
        if (value === undefined || value == null) {
            return "undefined";
        } else if ($.isArray(value.val) && value.val.length > 5) {
            return "[...]";
        } else {
            return ""+value.val;
        }
    };

    GridSpace.sorted_keys = function (obj) {
        var keys = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                keys.push(i);
            }
        }

        // may have to craft a custom sort function to get the right order
        keys.sort();
        return keys;
    };
});
