$(document).ready(function () {
    const dataTableOptions = {
        "responsive": true,
        "autoWidth": false,
        "order": [],
        "columnDefs": [
            { "orderable": false, "targets": [7] },
            { "className": "dt-center", "targets": [0, 1, 2, 3, 4, 5, 6] }
        ],
        "ajax": {
            "url": "http://localhost:3002/admin/applications",
            "type": "GET",
            "dataSrc": "",
            "cache": false,
            "error": function (xhr, error, thrown) {
                console.error("AJAX Error DataTable: ", error, thrown, xhr.responseText);
                showCustomSwal("DataTable Load Error!", `Failed to load. Status: ${xhr.status}. Check console.`, "error");
            }
        },
        "columns": [
            {
                "data": null, "title": "#",
                "render": function (data, type, row, meta) { return meta.row + 1; },
                "orderable": false
            },
            {
                "data": null, "title": "Name",
                "render": function (data, type, row) { return `${row.app_fname} ${row.app_lname}`; }
            },
            { "data": "app_email", "title": "Email" },
            {
                "data": "app_phone", "title": "Phone Number",
                "render": function (data) { return data ? '0' + data : 'N/A'; }
            },
            { "data": "app_position", "title": "Position" },
            {
                "data": "app_applied_at", "title": "Applied At",
                "render": function (data) {
                    if (!data) return 'N/A';
                    const date = new Date(data);
                    return `${date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}`;
                }
            },
            {
                "data": "app_status", "title": "Status",
                "render": function (data) {
                    if (!data) return 'N/A';
                    const statusLower = data.toLowerCase();
                    let statusClass = 'text-secondary';
                    if (statusLower === 'pending') statusClass = 'text-warning';
                    else if (statusLower === 'approved') statusClass = 'text-success';
                    else if (statusLower === 'rejected') statusClass = 'text-danger';
                    return `<strong><span class="${statusClass}">${data.charAt(0).toUpperCase() + data.slice(1)}</span></strong>`;
                }
            },
            {
                "data": "app_id", "title": "Actions", "className": "dt-left",
                "render": function (data, type, row) {
                    const isPending = row.app_status && row.app_status.toLowerCase() === 'pending';
                    const disabledAttribute = isPending ? '' : 'disabled';
                    const buttonStyle = isPending ? '' : 'background-color: #6c757d; border-color: #6c757d; color: white;';
                    const cursorStyle = isPending ? '' : 'cursor: not-allowed;';
                    const approveButton = `<button class="btn btn-success btn-sm approve-btn" data-id="${row.app_id}" data-tippy-content="Approve Application" style="width: 35px; height: 35px; display: inline-flex; justify-content: center; align-items: center; border: none; ${buttonStyle} ${cursorStyle}" ${disabledAttribute}><i class="fas fa-check"></i></button>`;
                    const rejectButton = `<button class="btn btn-danger btn-sm reject-btn" data-id="${row.app_id}" data-tippy-content="Reject Application" style="width: 35px; height: 35px; display: inline-flex; justify-content: center; align-items: center; border: none; ${buttonStyle} ${cursorStyle}" ${disabledAttribute}><i class="fas fa-times"></i></button>`;
                    return `<div class="action-buttons" style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: flex-start;"><button class="btn btn-info btn-sm view-info-btn" data-id="${row.app_id}" data-bs-toggle="modal" data-bs-target="#viewInfoModal" data-tippy-content="View Full Info" style="width: 35px; height: 35px; display: inline-flex; justify-content: center; align-items: center; border: none;"><i class="fas fa-eye"></i></button><button class="btn btn-primary btn-sm resume-action-btn view-resume-btn" data-action="view" data-id="${row.app_id}" data-fname="${row.app_fname}" data-lname="${row.app_lname}" data-tippy-content="View Resume" style="width: 35px; height: 35px; display: inline-flex; justify-content: center; align-items: center; border: none;"><i class="fas fa-file-alt"></i></button><button class="btn btn-warning btn-sm resume-action-btn download-resume-btn" data-action="download" data-id="${row.app_id}" data-fname="${row.app_fname}" data-lname="${row.app_lname}" data-tippy-content="Download Resume" style="width: 35px; height: 35px; display: inline-flex; justify-content: center; align-items: center; border: none;"><i class="fas fa-download"></i></button>${approveButton}${rejectButton}</div>`;
                }
            }
        ],
        "paging": true, "searching": true, "ordering": true, "pagingType": "full_numbers",
        "language": { "paginate": { "first": '<i class="fas fa-angle-double-left"></i>', "last": '<i class="fas fa-angle-double-right"></i>', "next": '<i class="fas fa-angle-right"></i>', "previous": '<i class="fas fa-angle-left"></i>' }, "emptyTable": "No applications found.", "loadingRecords": "Loading applications..." },
        "drawCallback": function (settings) {
            $('.dataTables_paginate .page-item.active .page-link').css({ 'background-color': 'var(--green)', 'color': 'white', 'border-color': 'var(--green)' });
            $('#dataTable thead').css({ 'background-color': 'var(--green)', 'color': 'white' });
            if ($('#statusFilter').length === 0 && settings.fnRecordsDisplay() > 0) {
                const filterHtml = `<label class="dt-filter-label"><select id="statusFilter" class="form-select form-select-sm d-inline-block custom-datatable-filter"><option value="">All</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="pending">Pending</option></select></label>`;
                $('#dataTable_filter').append(filterHtml);
                $('#statusFilter').on('change', function () { table.column(6).search(this.value ? '^' + this.value + '$' : '', true, false).draw(); });
            }
            destroyTippy(); initializeTippy();
        }
    };

    const table = $('#dataTable').DataTable(dataTableOptions);

    $('<style>')
        .prop('type', 'text/css')
        .html(`
        #dataTable_filter { display: flex; justify-content: flex-end; align-items: center; gap: 0.5rem; }
        #dataTable_filter label { margin-bottom: 0; }
        #dataTable_filter input[type="search"] { height: calc(1.5em + .5rem + 2px); }
        .dt-filter-label { margin-bottom: 0 !important; }
        .custom-datatable-filter {
            width: auto; vertical-align: middle; border: 1px solid #ced4da;
            background-color: #fff; color: #6c757d;
            padding-top: .25rem; padding-bottom: .25rem; padding-left: .5rem; padding-right: 2.5rem;
            font-size: .875rem; line-height: 1.5; border-radius: .2rem;
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
            -webkit-appearance: none; -moz-appearance: none; appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
            background-repeat: no-repeat; background-position: right .75rem center; background-size: 16px 12px;
            height: calc(1.5em + .5rem + 2px);
        }
        .custom-datatable-filter option { color: #6c757d; }
        .dataTables_wrapper select:focus,
        .dataTables_wrapper input[type="search"]:focus,
        .custom-datatable-filter:focus { border-color: #ced4da; outline: 0 !important; box-shadow: none !important; }
        .modal-action-button {
            width: 45px; height: 45px; display: inline-flex;
            justify-content: center; align-items: center; border: none;
            opacity: 0; /* Initially transparent for animation */
        }
        /* AnimateCSS will handle opacity if class is applied after d-none removed */
    `)
        .appendTo('head');

    function showCustomSwal(title, text, icon) {
        return Swal.fire({ // Ensure Swal.fire promise is returned
            title: title, text: text, icon: icon, confirmButtonColor: '#28a745',
            customClass: { popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel' },
            didOpen: () => { $('.swal-custom-popup').css({ 'border': '20px solid #f2f2f2', 'box-shadow': '0 0 0 10px var(--green)' }); }
        });
    }

    $('#dataTable').on('click', '.view-info-btn', function () {
        const id = $(this).data('id');
        const modal = $('#viewInfoModal');
        modal.removeData(); // Clear all modal data
        $('#app_name, #app_address, #app_email, #app_phone, #app_position, #app_message, #app_applied_at').val('');
        $('#status_image, #status_date_display, .modal-action-button')
            .attr('src', function (idx, val) { return $(this).is('img') ? '' : val; })
            .html(function (idx, val) { return $(this).is('p') ? '' : val; })
            .addClass('d-none').css('opacity', function () { return $(this).hasClass('modal-action-button') ? 0 : ''; })
            .removeClass('animate__animated animate__jackInTheBox animate__fadeIn animate__fadeInUp');
        $('#modalApproveApplicationBtn, #modalRejectApplicationBtn').removeData('id');

        $.ajax({
            url: `http://localhost:3002/admin/applications/view-info/${id}`,
            method: 'GET',
            success: function (response) {
                $('#app_name').val(`${response.app_fname} ${response.app_lname}`);
                $('#app_address').val(response.app_address || 'N/A');
                $('#app_email').val(response.app_email || 'N/A');
                $('#app_phone').val(response.app_phone ? '0' + response.app_phone : 'N/A');
                $('#app_position').val(response.app_position || 'N/A');
                $('#app_message').val(response.app_message || 'N/A');
                $('#app_applied_at').val(response.app_applied_at ? new Date(response.app_applied_at).toLocaleString() : 'N/A');
                modal.data({ 'appId': id, 'appFname': response.app_fname, 'appLname': response.app_lname });
                $('#modalApproveApplicationBtn, #modalRejectApplicationBtn').attr('data-id', id);

                let statusTextForDisplay = '', statusImageSrc = '', typedStrings = [];
                const currentStatus = response.app_status ? response.app_status.toLowerCase() : '';
                if (response.app_approved_at) {
                    statusTextForDisplay = `<strong>${new Date(response.app_approved_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</strong>`;
                    statusImageSrc = 'assets/img/approved.png'; typedStrings = [statusTextForDisplay];
                } else if (response.app_rejected_at) {
                    statusTextForDisplay = `<strong>${new Date(response.app_rejected_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</strong>`;
                    statusImageSrc = 'assets/img/rejected.png'; typedStrings = [statusTextForDisplay];
                } else if (currentStatus === 'pending') {
                    statusImageSrc = 'assets/img/pending.png'; statusTextForDisplay = '';
                }

                const $statusImage = $('#status_image'), $statusDateEl = $('#status_date_display');
                const $viewResumeBtn = $('#viewResumeBtn'), $downloadResumeBtn = $('#downloadResumeBtn');
                const $modalApproveBtn = $('#modalApproveApplicationBtn'), $modalRejectBtn = $('#modalRejectApplicationBtn');

                $statusImage.attr('src', statusImageSrc); $statusDateEl.html(statusTextForDisplay);
                if (window.typedStatusDate) { window.typedStatusDate.destroy(); window.typedStatusDate = null; }
                if (typedStrings.length > 0 && statusTextForDisplay) {
                    $statusDateEl.text('');
                    window.typedStatusDate = new Typed("#status_date_display", { strings: typedStrings, typeSpeed: 50, loop: false, showCursor: false, startDelay: 400 });
                }

                setTimeout(() => { $statusImage.removeClass('d-none').addClass('animate__animated animate__jackInTheBox'); }, 200);
                if (statusTextForDisplay) { setTimeout(() => { $statusDateEl.removeClass('d-none').addClass('animate__animated animate__fadeIn'); }, 600); }

                let baseDelayForButtons = (statusTextForDisplay !== '') ? 800 : 200;
                if (currentStatus === 'pending' && !statusTextForDisplay) baseDelayForButtons = 200;

                function animateButton($button, delay, animationClass = 'animate__fadeInUp') {
                    setTimeout(() => {
                        $button.removeClass('d-none');
                        setTimeout(() => { $button.addClass('animate__animated ' + animationClass).css('opacity', 1); }, 20);
                    }, delay);
                }

                animateButton($viewResumeBtn, baseDelayForButtons);
                animateButton($downloadResumeBtn, baseDelayForButtons + 150);
                if (currentStatus === 'pending') {
                    const modalActionBtnBaseDelay = baseDelayForButtons + 300;
                    animateButton($modalApproveBtn, modalActionBtnBaseDelay);
                    animateButton($modalRejectBtn, modalActionBtnBaseDelay + 150);
                }
                $('#viewInfoModal').modal('show');
            },
            error: function (xhr) { showCustomSwal('Error!', (xhr.responseJSON?.message || 'Error fetching details.'), 'error'); }
        });
    });

    $('#viewInfoModal').on('shown.bs.modal', () => { destroyTippy(); initializeTippy(); });
    $('#viewInfoModal').on('hidden.bs.modal', () => {
        if (window.typedStatusDate) { window.typedStatusDate.destroy(); window.typedStatusDate = null; }
        $('.modal-action-button').addClass('d-none').css('opacity', 0);
    });

    function handleResumeAction(action, id, fname, lname) {
        const fullName = `${fname}_${lname}`;
        const url = action === 'view' ? `http://localhost:3002/admin/applications/view-resume/${id}?name=${fullName}` : `http://localhost:3002/admin/applications/download-resume/${id}?name=${fullName}`;
        $.ajax({
            url: url, method: 'GET', xhrFields: { responseType: action === 'download' ? 'blob' : undefined },
            success: function (data, status, xhr) {
                if (action === 'view') {
                    if (xhr.getResponseHeader('content-type')?.includes('application/pdf') && typeof data !== 'string') {
                        const blob = new Blob([data], { type: 'application/pdf' }); const blobUrl = URL.createObjectURL(blob);
                        window.open(blobUrl, '_blank'); setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                    } else { window.open(url, '_blank'); }
                } else if (action === 'download') {
                    const blob = new Blob([data], { type: xhr.getResponseHeader('content-type') }); const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob); let filename = `${fullName}_resume.pdf`;
                    const disposition = xhr.getResponseHeader('Content-Disposition');
                    if (disposition?.includes('attachment')) { const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition); if (matches?.[1]) filename = matches[1].replace(/['"]/g, ''); }
                    link.download = filename; document.body.appendChild(link); link.click(); document.body.removeChild(link); window.URL.revokeObjectURL(link.href);
                }
            },
            error: function (xhr) { showCustomSwal('Error!', (xhr.responseJSON?.message || `Error ${action}ing resume.`), 'error'); }
        });
    }
    $('#dataTable').on('click', '.resume-action-btn', function () { handleResumeAction($(this).data('action'), $(this).data('id'), $(this).data('fname'), $(this).data('lname')); });
    $('#viewResumeBtn, #downloadResumeBtn').off('click').on('click', function () {
        const action = $(this).attr('id') === 'viewResumeBtn' ? 'view' : 'download'; const modal = $('#viewInfoModal'); const { appId, appFname, appLname } = modal.data();
        if (appId && appFname && appLname) handleResumeAction(action, appId, appFname, appLname); else showCustomSwal('Error!', 'Cannot get application details.', 'error');
    });

    const createActionHandler = (actionType) => {
        return function () {
            if ($(this).is(':disabled')) { return; }
            const id = $(this).data('id');
            if (!id) {
                showCustomSwal('Error!', 'Application ID missing.', 'error');
                return;
            }
            Swal.fire({
                title: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Application?`,
                text: `You are about to ${actionType} this application.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: actionType === 'approve' ? '#28a745' : '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: `Yes, ${actionType} it!`,
                customClass: { popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel' },
                didOpen: () => { $('.swal-custom-popup').css({ 'border': '20px solid #f2f2f2', 'box-shadow': '0 0 0 10px var(--green)' }); }
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: `http://localhost:3002/admin/applications/${actionType}/${id}`,
                        method: 'POST',
                        success: function (response) {
                            showCustomSwal(
                                `${actionType.charAt(0).toUpperCase() + actionType.slice(1)}d!`,
                                response.message || `Application ${actionType}d.`,
                                'success'
                            ).then(() => {
                                window.location.reload(); // Reloads the page after the success Swal is dismissed
                            });
                        },
                        error: function (xhr) {
                            showCustomSwal('Error!', (xhr.responseJSON?.message || `Error ${actionType}ing.`), 'error');
                        }
                    });
                }
            });
        };
    };
    $('#dataTable').on('click', '.approve-btn', createActionHandler('approve'));
    $('#dataTable').on('click', '.reject-btn', createActionHandler('reject'));
    $('#modalApproveApplicationBtn').on('click', createActionHandler('approve'));
    $('#modalRejectApplicationBtn').on('click', createActionHandler('reject'));

    function initializeTippy() {
        tippy('[data-tippy-content]', {
            theme: 'light-border', placement: 'top', arrow: true, animation: 'fade', duration: [200, 200], delay: [100, 100], maxWidth: 200,
            onShow(instance) { $(instance.popper.querySelector('.tippy-box')).css({ 'background-color': '#ffffff', 'color': '#333333', 'border': '1px solid var(--green)', 'box-shadow': '0 2px 5px rgba(0,0,0,0.1)' }); }
        });
    }
    function destroyTippy() { $('[data-tippy-content]').each(function () { if (this._tippy) this._tippy.destroy(); }); }
});