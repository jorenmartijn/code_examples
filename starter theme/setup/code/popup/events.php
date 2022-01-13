<script type="text/javascript">

    // Fires immediately before the modal opens. Closes any other modals that are currently open
    $(document).on("open.zf.reveal", function(event){
        console.log(event);
    });

    // Fires when the modal has successfully opened.
    $(document).on("closeme.zf.reveal", function(event){
        console.log(event);
    });

    // Fires when the modal is done closing.
    $(document).on("closed.zf.reveal", function(event){
        console.log(event);
    });
</script>