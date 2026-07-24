// Lazy-loads SweetAlert2 only when called — keeps it out of the initial bundle
export async function swal(opts) {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire(opts);
}

export async function swalConfirm({ title, text, confirmText = "Confirm", danger = false }) {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: danger ? "#d33" : "#f97316",
    cancelButtonColor: "#94a3b8",
    confirmButtonText: confirmText,
  });
}

export async function swalSuccess(title, timer = 1500) {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire({ icon: "success", title, timer, showConfirmButton: false });
}

export async function swalError(title, text) {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire({ icon: "error", title, text });
}
