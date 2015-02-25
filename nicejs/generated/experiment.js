// **********************************************************************
//
// Copyright (c) 2003-2014 ZeroC, Inc. All rights reserved.
//
// This copy of Ice is licensed to you under the terms described in the
// ICE_LICENSE file included in this distribution.
//
// **********************************************************************
//
// Ice version 3.5.1
//
// <auto-generated>
//
// Generated from file `experiment.ice'
//
// Warning: do not edit this file.
//
// </auto-generated>
//

(function(global, r)
{
    var require = typeof(r) === "function" ? r : function(){};
    require("Ice/Object");
    require("Ice/ObjectPrx");
    require("Ice/Operation");
    require("Ice/EnumBase");
    require("Ice/Long");
    require("Ice/HashMap");
    require("Ice/HashUtil");
    require("Ice/ArrayUtil");
    require("Ice/StreamHelpers");
    
    var Ice = global.Ice || {};
    require("data");
    
    var nice = global.nice || {};
    nice.api = nice.api || {};
    nice.api.experiment = nice.api.experiment || {};

    nice.api.experiment.PublishMode = Slice.defineEnum({
        'NORMAL':0, 'DEFERRED':1, 'PROPRIETARY':2});

    /**
     * Experiment state
     * 
     **/
    nice.api.experiment.ExperimentData = Slice.defineObject(
        function(id, isIMS, numericID, path, clientPath, title, description, participants, emails, creationTimeStamp, isNew, publish)
        {
            Ice.Object.call(this);
            this.id = id !== undefined ? id : null;
            this.isIMS = isIMS !== undefined ? isIMS : false;
            this.numericID = numericID !== undefined ? numericID : 0;
            this.path = path !== undefined ? path : null;
            this.clientPath = clientPath !== undefined ? clientPath : null;
            this.title = title !== undefined ? title : null;
            this.description = description !== undefined ? description : null;
            this.participants = participants !== undefined ? participants : null;
            this.emails = emails !== undefined ? emails : null;
            this.creationTimeStamp = creationTimeStamp !== undefined ? creationTimeStamp : 0;
            this.isNew = isNew !== undefined ? isNew : false;
            this.publish = publish !== undefined ? publish : nice.api.experiment.NORMAL;
        },
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::nice::api::experiment::ExperimentData"
        ],
        -1,
        function(__os)
        {
            __os.writeString(this.id);
            __os.writeBool(this.isIMS);
            __os.writeLong(this.numericID);
            __os.writeString(this.path);
            __os.writeString(this.clientPath);
            __os.writeString(this.title);
            __os.writeString(this.description);
            __os.writeString(this.participants);
            nice.api.data.StringArrayHelper.write(__os, this.emails);
            __os.writeLong(this.creationTimeStamp);
            __os.writeBool(this.isNew);
            nice.api.experiment.PublishMode.__write(__os, this.publish);
        },
        function(__is)
        {
            this.id = __is.readString();
            this.isIMS = __is.readBool();
            this.numericID = __is.readLong();
            this.path = __is.readString();
            this.clientPath = __is.readString();
            this.title = __is.readString();
            this.description = __is.readString();
            this.participants = __is.readString();
            this.emails = nice.api.data.StringArrayHelper.read(__is);
            this.creationTimeStamp = __is.readLong();
            this.isNew = __is.readBool();
            this.publish = nice.api.experiment.PublishMode.__read(__is);
        },
        false);

    nice.api.experiment.ExperimentDataPrx = Slice.defineProxy(Ice.ObjectPrx, nice.api.experiment.ExperimentData.ice_staticId, undefined);

    Slice.defineOperations(nice.api.experiment.ExperimentData, nice.api.experiment.ExperimentDataPrx);
    Slice.defineDictionary(nice.api.experiment, "ExperimentDataMap", "ExperimentDataMapHelper", "Ice.StringHelper", "Ice.ObjectHelper", false, false, "nice.api.experiment.ExperimentData");

    nice.api.experiment.ExperimentMonitor = Slice.defineObject(
        undefined,
        Ice.Object, undefined, 1,
        [
            "::Ice::Object",
            "::nice::api::experiment::ExperimentMonitor"
        ],
        -1, undefined, undefined, false);

    nice.api.experiment.ExperimentMonitorPrx = Slice.defineProxy(Ice.ObjectPrx, nice.api.experiment.ExperimentMonitor.ice_staticId, undefined);

    Slice.defineOperations(nice.api.experiment.ExperimentMonitor, nice.api.experiment.ExperimentMonitorPrx,
    {
        "onSubscribe": [, , , , , , [["nice.api.experiment.ExperimentDataMapHelper"], ["nice.api.experiment.ExperimentData", true]], , , true, ],
        "switchedCurrentExperiment": [, , , , , , [["nice.api.experiment.ExperimentData", true]], , , true, ],
        "modifiedCurrentExperiment": [, , , , , , [["nice.api.experiment.ExperimentData", true]], , , true, ],
        "createdExperiment": [, , , , , , [["nice.api.experiment.ExperimentData", true]], , , true, ]
    });
    global.nice = nice;
}
(typeof (global) === "undefined" ? window : global, typeof (require) === "undefined" ? undefined : require));
