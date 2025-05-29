$(document).ready(function () {
    // Store options to avoid repetition
    const dataTableOptions = {
        "processing": true,
        "serverSide": false,
        "data": [], // Initialize with empty data. Data will be loaded in AJAX success
        "columns": [
            {
                "data": null,
                "title": "Full Name",
                "render": function (data) {
                    return `${data.app_fname} ${data.app_lname}`;
                }
            },
            { "data": "app_address", "title": "Address" },
            { "data": "app_email", "title": "Email" },
            { "data": "app_phone", "title": "Phone" },
            {
                "data": "app_position",
                "title": "Position",
                "render": function (data) {
                    return data.charAt(0).toUpperCase() + data.slice(1);
                }
            },
            {
                "data": "app_applied_at",
                "title": "Applied At",
                "render": function (data) {
                    return data ? new Date(data).toLocaleString() : 'N/A';
                }
            },
            {
                "data": "app_status",
                "title": "Status",
                "render": function (data) {
                    const statusLower = data.toLowerCase();
                    let statusClass = '';

                    switch (statusLower) {
                        case 'pending':
                            statusClass = 'text-warning';
                            break;
                        case 'approved':
                            statusClass = 'text-success';
                            break;
                        case 'rejected':
                            statusClass = 'text-danger';
                            break;
                        default:
                            statusClass = 'text-secondary';
                    }

                    return `<strong><span class="${statusClass}">${data.charAt(0).toUpperCase() + data.slice(1)}</span></strong>`;
                }
            },
            {
                "data": "app_id",
                "title": "Actions",
                "render": function (data, type, row) {
                    const isDisabled = row.app_status.toLowerCase() !== 'pending';
                    const cursorStyle = isDisabled ? 'cursor: not-allowed;' : '';
                    const buttonStyle = isDisabled ? 'background-color: gray; color: white;' : '';
                    const disabledAttribute = isDisabled ? 'disabled' : '';

                    return `
                    <div class="action-buttons" style="display: flex; flex-wrap: wrap; gap: 5px;">
                        <button class="btn btn-info btn-sm view-info-btn" data-id="${row.app_id}" data-bs-toggle="modal" data-bs-target="#viewInfoModal" data-tippy-content="View Full Info" style="width: 35px; height: 35px; display: flex; justify-content: center; align-items: center; border: none;">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-primary btn-sm resume-action-btn view-resume-btn" data-action="view" data-id="${row.app_id}" data-fname="${row.app_fname}" data-lname="${row.app_lname}" data-tippy-content="View Resume" style="width: 35px; height: 35px; display: flex; justify-content: center; align-items: center; border: none;">
                            <i class="fas fa-file-alt"></i>
                        </button>
                        <button class="btn btn-warning btn-sm resume-action-btn download-resume-btn" data-action="download" data-id="${row.app_id}" data-fname="${row.app_fname}" data-lname="${row.app_lname}" data-tippy-content="Download Resume" style="width: 35px; height: 35px; display: flex; justify-content: center; align-items: center; border: none;">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn btn-success btn-sm approve-btn" data-id="${row.app_id}" data-tippy-content="Approve Application" style="width: 35px; height: 35px; display: flex; justify-content: center; align-items: center; border: none; ${cursorStyle} ${buttonStyle}" ${disabledAttribute}>
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-danger btn-sm reject-btn" data-id="${row.app_id}" data-tippy-content="Reject Application" style="width: 35px; height: 35px; display: flex; justify-content: center; align-items: center; border: none; ${cursorStyle} ${buttonStyle}" ${disabledAttribute}>
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                }
            }
        ],
        "paging": true,
        "searching": true,
        "ordering": true,
        "pagingType": "full_numbers",
        "language": {
            "paginate": {
                "first": '<i class="fas fa-angle-double-left text-gray-500"></i>',
                "last": '<i class="fas fa-angle-double-right text-gray-500"></i>',
                "next": '<i class="fas fa-angle-right text-gray-500"></i>',
                "previous": '<i class="fas fa-angle-left text-gray-500"></i>'
            }
        },
        "drawCallback": function () {
            // Styles
            $('.dataTables_paginate .page-item.active .page-link').css({
                'background-color': 'var(--green)',
                'color': 'white',
                'border': '1px solid var(--green)'
            });

            $('#dataTable thead').css({
                'background-color': 'var(--green)',
                'color': 'white'
            });

            $('#dataTable_wrapper select').hover(
                function () { $(this).css('background-color', '#f2f2f2'); },
                function () { $(this).css('background-color', ''); }
            );

        },
    };

    const table = $('#dataTable').DataTable(dataTableOptions);

    // Centralized Swal Fire function
    function showCustomSwal(title, text, icon) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonColor: '#28a745',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                confirmButton: 'swal-custom-confirm',
                cancelButton: 'swal-custom-cancel'
            },
            didOpen: () => {
                const popup = document.querySelector('.swal-custom-popup');
                popup.style.border = '20px solid #f2f2f2';
                popup.style.boxShadow = '0 0 0 10px var(--green)';
            }
        });
    }

    $('#dataTable').on('click', '.view-info-btn', function () {
        const id = $(this).data('id');
        const modal = $('#viewInfoModal'); // Get the modal element

        // Clear data from previous openings
        modal.removeData('typedStrings');
        modal.removeData('appId');
        modal.removeData('appFname');
        modal.removeData('appLname');

        $.ajax({
            url: `http://localhost:3002/admin/applications/view-info/${id}`,
            method: 'GET',
            success: function (response) {
                $('#app_name').val(`${response.app_fname} ${response.app_lname}`);
                $('#app_address').val(response.app_address || 'N/A');
                $('#app_email').val(response.app_email || 'N/A');
                $('#app_phone').val(response.app_phone || 'N/A');
                $('#app_position').val(response.app_position || 'N/A');
                $('#app_message').val(response.app_message || 'N/A');
                $('#app_applied_at').val(response.app_applied_at ? new Date(response.app_applied_at).toLocaleString() : 'N/A');
                $('#app_resume_path').text(''); // Remove the resume file name

                let statusDate = '';
                let statusImageSrc = '';
                let typedStrings = [];

                if (response.app_approved_at) {
                    const approvedDate = new Date(response.app_approved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    statusDate = `<strong>${approvedDate}</strong>`;
                    statusImageSrc = 'assets/img/approved.png';
                    typedStrings = [statusDate];
                } else if (response.app_rejected_at) {
                    const rejectedDate = new Date(response.app_rejected_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    statusDate = `<strong>${rejectedDate}</strong>`;
                    statusImageSrc = 'assets/img/rejected.png';
                    typedStrings = [statusDate];
                } else if (response.app_status.toLowerCase() === 'pending') {
                    statusImageSrc = 'assets/img/pending.png';
                }

                $('#status_date').html(statusDate);
                $('#status_image').attr('src', statusImageSrc);

                // Store data in the modal for use during modal show event.
                modal.data('typedStrings', typedStrings);
                modal.data('appId', id); // Store app_id for resume actions
                modal.data('appFname', response.app_fname); //Store first name
                modal.data('appLname', response.app_lname); //Store last name

                // // Clear the content of the element before initializing Typed
                $('#status_date').text('');

                // Destroy Typed instance if it exists
                if (window.typedStatusDate) {
                    window.typedStatusDate.destroy();
                    window.typedStatusDate = null;
                }

                // Initialize Typed instance and store it in the window object
                window.typedStatusDate = new Typed("#status_date", {
                    strings: typedStrings,
                    typeSpeed: 50,
                    backSpeed: 50,
                    loop: false,
                    showCursor: false,
                    startDelay: 400,
                    backDelay: 500,

                });

                // **Animation Logic Here:**
                const hasStatusDate = statusDate !== ''; // Check if statusDate has any text content

                // Remove any existing classes before applying animation
                $('#status_image').removeClass('animate__animated animate__jackInTheBox d-none');
                $('#status_date').removeClass('animate__animated animate__fadeIn d-none');
                $('#viewResumeBtn').removeClass('animate__animated animate__fadeInUp d-none');
                $('#downloadResumeBtn').removeClass('animate__animated animate__fadeInUp d-none');

                // Add "d-none" class initially for all elements
                $('#status_image').addClass('d-none');
                $('#status_date').addClass('d-none');
                $('#viewResumeBtn').addClass('d-none');
                $('#downloadResumeBtn').addClass('d-none');

                setTimeout(function () {
                    $('#status_image').removeClass('d-none').addClass('animate__animated animate__jackInTheBox');
                }, 200);

                setTimeout(function () {
                    $('#status_date').removeClass('d-none').addClass('animate__animated animate__fadeIn');
                }, 400);

                setTimeout(function () {
                    $('#viewResumeBtn').removeClass('d-none').addClass('animate__animated animate__fadeInUp');
                }, hasStatusDate ? 600 : 400); //Use hasStatusDate

                setTimeout(function () {
                    $('#downloadResumeBtn').removeClass('d-none').addClass('animate__animated animate__fadeInUp');
                }, hasStatusDate ? 800 : 600); //Use hasStatusDate

                $('#viewInfoModal').modal('show'); // Show the modal AFTER setting the data
                destroyTippy(); // Destroy Tippy instances before reinitializing them
                initializeTippy(); // Initialize Tippy instances for the modal buttons
            },
            error: function (xhr) {
                const errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'There was an error fetching the application details.';
                showCustomSwal('Error!', errorMessage, 'error');
            }
        });
    });

    // Combined function for handling resume actions (view and download) with AJAX
    function handleResumeAction(action, id, fname, lname) {
        const fullName = `${fname}_${lname}`;
        let url;

        if (action === 'view') {
            url = `http://localhost:3002/admin/applications/view-resume/${id}?name=${fullName}`;
        } else if (action === 'download') {
            url = `http://localhost:3002/admin/applications/download-resume/${id}?name=${fullName}`;
        } else {
            console.error('Invalid action:', action);
            return;
        }
        $.ajax({
            url: url,
            method: 'GET',
            success: function () {
                if (action === 'view') {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
            },
            error: function (xhr) {
                const errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : `There was an error ${action}ing the resume.`;
                console.error(`Error ${action}ing resume:`, errorMessage);
                showCustomSwal('Error!', errorMessage, 'error');
            }
        });
    }

    // Combined click handler for View and Download Resume buttons in DataTable
    $('#dataTable').on('click', '.resume-action-btn', function () {
        const action = $(this).data('action');
        const id = $(this).data('id');
        const fname = $(this).data('fname');
        const lname = $(this).data('lname');

        handleResumeAction(action, id, fname, lname);
    });

    // Click handlers for View/Download Resume buttons inside the modal
    $('#viewResumeBtn, #downloadResumeBtn').off('click').on('click', function () {
        const action = $(this).attr('id') === 'viewResumeBtn' ? 'view' : 'download';
        const modal = $('#viewInfoModal');
        const id = modal.data('appId');
        const fname = modal.data('appFname');
        const lname = modal.data('appLname');

        handleResumeAction(action, id, fname, lname);
    });

    // Use a delegated event listener to detect any modal opening
    $(document).on('show.bs.modal', '.modal', function () {
        destroyTippy();
    });

    // Modal hidden event handler: Reinitialize Tippy instances.
    $(document).on('hidden.bs.modal', '.modal', function () {
        initializeTippy();

    });

    // Approve and Reject button click handlers
    const createActionHandler = (action) => {
        return function () {
            const id = $(this).data('id');
            const title = action === 'approve' ? 'Approve Application?' : 'Reject Application?';
            const text = `You are about to ${action} this application.`;
            const confirmButtonColor = action === 'approve' ? '#28a745' : '#d33';
            const cancelButtonColor = action === 'approve' ? '#d33' : '#28a745';
            const confirmButtonText = `Yes, ${action} it!`;
            Swal.fire({
                title: title,
                text: text,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: confirmButtonColor,
                cancelButtonColor: cancelButtonColor,
                confirmButtonText: confirmButtonText,
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    confirmButton: 'swal-custom-confirm',
                    cancelButton: 'swal-custom-cancel'
                },
                didOpen: () => {
                    const popup = document.querySelector('.swal-custom-popup');
                    popup.style.border = '20px solid #f2f2f2';
                    popup.style.boxShadow = '0 0 0 10px var(--green)';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: `http://localhost:3002/admin/applications/${action}/${id}`,
                        method: 'POST',
                        success: function () {
                            location.reload();
                        },
                        error: function () {
                            Swal.fire(
                                'Error!',
                                `There was an error ${action}ing the application.`,
                                'error'
                            );
                        }
                    });
                }
            });
        };
    };

    $('#dataTable').on('click', '.approve-btn', createActionHandler('approve'));
    $('#dataTable').on('click', '.reject-btn', createActionHandler('reject'));

    $.ajax({
        "url": "http://localhost:3002/admin/applications",
        "cache": false,
        "headers": { "Cache-Control": "no-cache, no-store, must-revalidate" },
        "success": function (response) {
            console.log("✅ Data fetched successfully:", response);

            let data = Array.isArray(response) ? response : [];
            table.clear().rows.add(data).draw();

            // Add the filter dropdown
            $('#dataTable_filter').append(`
                <label style="margin-left: 10px;">
                    Filter by status:
                    <select id="statusFilter" class="form-control form-control-sm" style="width: auto; display: inline-block; margin-left: 5px;">
                        <option value="">All</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                    </select>
                </label>
            `);

            // Filter by status
            $('#statusFilter').on('change', function () {
                const status = $(this).val().toLowerCase();
                table.column(6).search(status).draw();
            });

            //INITIALIZE TOOLTIPS HERE, AFTER AJAX SUCCESS
            initializeTippy();

        },
        "error": function (xhr, error, thrown) {
            console.error("❌ AJAX Error: ", error, thrown);
            console.error("❌ Response: ", xhr.responseText);
            alert("Error fetching data. Check console for details.");
        }
    });

    //Function to initialize tooltips
    function initializeTippy() {
        tippy('[data-tippy-content]', {
            theme: 'light-border',
            placement: 'top',
            arrow: true,
            duration: [200, 200],
            delay: [100, 100],
            maxWidth: 200,
            onShow(instance) {
                const box = instance.popper.querySelector('.tippy-box');
                box.style.backgroundColor = '#ffffff';
                box.style.color = '#333333';
                box.style.border = '1px solid #28a745';
            }
        });
    }

    // Function to destroy tooltips
    function destroyTippy() {
        $('[data-tippy-content]').each(function () {
            if (this._tippy) {
                this._tippy.destroy();
            }
        });
    }
});