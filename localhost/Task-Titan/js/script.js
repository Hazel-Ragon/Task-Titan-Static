document.addEventListener('DOMContentLoaded', () => {
    // Función para abrir el modal
    window.openModal = function($el) {
        $el.classList.add('is-active'); // Añade la clase 'is-active' para mostrar el modal
    }

    // Función para cerrar el modal
    function closeModal($el) {
        $el.classList.remove('is-active'); // Remueve la clase 'is-active' para ocultar el modal
    }

    // Función para cerrar todos los modales abiertos
    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Agrega evento click a los botones que abren el modal
    (document.querySelectorAll('.modal-button') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);
        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Agrega evento click a los elementos que cierran el modal
    (document.querySelectorAll('.modal .delete, .modal .modal-background, .modal .cancel') || []).forEach(($close) => {
        const $target = $close.closest('.modal');
        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Cerrar los Modales con la tecla ESC
    document.addEventListener('keydown', (event) => {
        const key = event.key || event.keyCode;
        if (key === 'Escape' || key === 27) {
            closeAllModals();
        }
    });

    // Validación y envío del formulario de registro
    document.getElementById('registroForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.target;
        const password = form.password.value;
        const confirmPassword = form.confirm_password.value;

        if (password !== confirmPassword) {
            showNotification('danger', 'Las contraseñas no coinciden');
            return;
        }

        // Envía el formulario usando fetch
        fetch(form.action, {
            method: form.method,
            body: new FormData(form)
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('success', data.message);
                    form.reset();
                    closeAllModals();
                } else {
                    showNotification('danger', data.message);
                }
            });
    });

    // Validación y envío del formulario de inicio de sesión
    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.target;
        fetch(form.action, {
            method: form.method,
            body: new FormData(form)
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "dashboard.php";
                } else {
                    showNotification('danger', data.message);
                }
            });
    });

    // Funcionalidad para el botón "Olvidé mi contraseña"
    document.getElementById('forgotPassword').addEventListener('click', (event) => {
        event.preventDefault();
        const modal = document.getElementById('modalForgotPassword');
        openModal(modal);
    });

    // Envío del formulario de "Olvidé mi contraseña"
    document.getElementById('forgotPasswordForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('forgotEmail').value;

        if (!email) {
            showNotification('danger', 'Por favor, ingrese su correo electrónico.');
            return;
        }

        fetch('/Task-Titan/php/auth/forgot_password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('success', 'Se ha enviado un enlace para restablecer tu contraseña');
                    closeAllModals();
                } else {
                    showNotification('danger', data.message);
                }
            })
            .catch(error => {
                showNotification('danger', 'Error en la solicitud: ' + error);
            });
    });

    // Añadir funcionalidad al botón "Cancelar"
    (document.querySelectorAll('.modal .cancel') || []).forEach(($cancelButton) => {
        $cancelButton.addEventListener('click', (event) => {
            event.preventDefault();
            closeAllModals(); // Cierra el modal sin validar el formulario
        });
    });

    // Función para mostrar notificaciones
    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `notification is-${type}`;
        notification.innerHTML = message;

        // Seleccionamos el contenedor de notificaciones
        const notificationsContainer = document.getElementById('notifications');

        if (!notificationsContainer) {
            console.error('El contenedor de notificaciones no está presente en el DOM.');
            return;
        }

        // Añadimos la notificación al contenedor
        notificationsContainer.appendChild(notification);

        // Removemos la notificación después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});
