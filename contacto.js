let userName = "";

document.getElementById("contactButton").addEventListener("click", function () {
    Swal.fire({
        title: "Ingrese su nombre",
        input: "text",
        inputAttributes: {
        autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Siguiente",
        showLoaderOnConfirm: true,
        preConfirm: (name) => {
        console.log(name);
        userName = name;
        return name;
        },
        allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
        if (result.isConfirmed) {
        Swal.fire({
            title: "Ingrese su email",
            input: "email",
            showCancelButton: true,
            confirmButtonText: "Siguiente",
            showLoaderOnConfirm: true,
            preConfirm: (email) => {
            console.log(email);
            return email;
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
            Swal.fire({
                title: "Ingrese el modelo de teclado en el que está interesado",
                input: "text",
                showCancelButton: true,
                confirmButtonText: "Enviar",
                showLoaderOnConfirm: true,
                preConfirm: (model) => {
                console.log(model);
                return model;
                },
                allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
                if (result.isConfirmed) {
                Swal.fire({
                    title: "¡Gracias por su interés!",
                    text: `Hola ${userName} recibimos su solicitud. Muy pronto te vamos a estar enviando la teclado ${result.value}. Nos comunicaremos en breve.`,
                    icon: "success",
                });
                }
            });
            }
        });
        }
    });
});
