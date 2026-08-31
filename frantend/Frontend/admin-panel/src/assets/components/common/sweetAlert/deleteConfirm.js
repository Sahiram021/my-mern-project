import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export const confirmDelete = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Selected records delete ho jayenge.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
  });

  return result.isConfirmed;
};
