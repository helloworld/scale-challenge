var _ANNOTATION = [];
var editor;

$(document).ready(function() {
    if (App) initalizeBBox();
});

function initalizeBBox() {
    initializeEventHandlers();

    editor = new BBoxAnnotator({
        url: App.task.attachment,
        input_method: 'select',
        labels: App.task.objects_to_annotate,
        onchange: function(annotation) {
            renderAnnotation(annotation);
        }
    });
}

function initializeEventHandlers() {
    $("#submit").on("click", submitAnnotation);
    $("#reset").on("click", resetAnnotation);
}

function renderAnnotation(annotation) {
    _ANNOTATION = annotation;
    $("#annotation_data").text(JSON.stringify(annotation, null, "  "));
}

function submitAnnotation() {
    $.ajax({
        type: "POST",
        url: "/backpanel/complete/" + App.task._id ,
        data: {
            'annotation': JSON.stringify(_ANNOTATION)
        },
        success: function(msg) {
            window.location.href = '/backpanel';

        }
    });
}

function resetAnnotation() {
    editor.clear_all();
}
