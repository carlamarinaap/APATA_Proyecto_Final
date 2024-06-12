const socket = io();

const usersList = document.getElementById("usersList");

const deleteUser = (id) => {
  Swal.fire({
    title: `Estas seguro que querés eliminar el usuario?`,
    showCancelButton: true,
    confirmButtonColor: "#198754",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminalo!",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit("deleteUser", { id });
    }
  });
};

const changeRole = (id) => {
  Swal.fire({
    title: `Estás seguro que de actualizar el usuario?`,
    showCancelButton: true,
    confirmButtonColor: "#198754",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit("changeRoleUser", { id });
    }
  });
};

socket.on("cardAdmin", (data) => {
  if (data.updated) {
    Swal.fire({
      title: "Actualizado!",
      text: "Se actualizó el rol del usuario",
      icon: "success",
    }).then(() => {});
  } else {
    if (data.deleted) {
      Swal.fire({
        title: "Eliminado!",
        text: "El usuario fue eliminado",
        icon: "success",
      }).then(() => {});
    }
  }
  const allUsers = data.users.map((user) => {
    return `
    <li class="list-group-item bg-light m-1">
    <div class="d-flex justify-content-between">
      <div>
        <p class="card-text text-start">Usuario: ${user.email}</p>
        <p class="card-text text-start">Rol: ${user.role}</p>
      </div>
      <div class="align-content-center">
        <a
          class="btn btn-outline-primary"
          onclick="changeRole('${user.email}')"
          >Cambiar Rol</a>
        <a
          href="#"
          class="btn btn-danger"
          onclick="deleteUser('${user._id}')"
        >Eliminar</a>
      </div>
    </div>
  </li>`;
  });

  usersList.innerHTML = allUsers.join("");
});
