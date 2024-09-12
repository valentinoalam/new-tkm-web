<script setup>
import { Eye, EyeOff } from 'lucide-vue-next';
import { useForm, useField } from 'vee-validate';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog'; // use your desired UI components
import { update } from '@/service/userService';
// FormControl,
//   TextField,
//   FormLabel,
//   Box,
const isOpen = ref(false);

const initialValues = {
  password: '',
  passwordNew: '',
  confirmPassword: '',
};

const schema = yup.object().shape({
  password: yup
    .string()
    .required('Password lama harus diisi')
    .min(6, 'Password harus memiliki minimal 6 karakter'),
  passwordNew: yup
    .string()
    .required('Password baru harus diisi')
    .min(6, 'Password harus memiliki minimal 6 karakter'),
  confirmPassword: yup
    .string()
    .required('Konfirmasi password harus diisi')
    .oneOf([yup.ref('passwordNew')], 'Password tidak cocok'),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues,
});

const password = useField('password');
const passwordNew = useField('passwordNew');
const confirmPassword = useField('confirmPassword');

const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleDialogClose = () => {
  isOpen.value = false;
  resetForm();
};

const onSubmit = values => {
  update(values)
    .then(res => {
      toast.success('Data Berhasil Disimpan');
    })
    .catch(error => {
      toast.error('Data Gagal Disimpan: ' + error.message);
    })
    .finally(() => {
      resetForm();
      handleDialogClose();
    });
};
</script>

<template>
  <Dialog v-model:show="isOpen" size="sm" title="Ganti Password">
    <form @submit="handleSubmit(onSubmit)">
      <Box class="grid gap-4">
        <FormControl>
          <FormLabel>Password Lama</FormLabel>
          <TextField
            v-model="password.value"
            :error="password.errorMessage"
            placeholder="Masukan Password ..."
            type="password"
            :suffix="showPassword ? Eye : EyeOff"
            @click="togglePasswordVisibility"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password Baru</FormLabel>
          <TextField
            v-model="passwordNew.value"
            :error="passwordNew.errorMessage"
            placeholder="Masukan Password Baru ..."
          />
        </FormControl>

        <FormControl>
          <FormLabel>Re-type Password Baru</FormLabel>
          <TextField
            v-model="confirmPassword.value"
            :error="confirmPassword.errorMessage"
            placeholder="Confirm Password ..."
          />
        </FormControl>
      </Box>

      <DialogActions>
        <Button @click="handleDialogClose">Cancel</Button>
        <Button type="submit" variant="contained">Simpan</Button>
      </DialogActions>
    </form>
  </Dialog>
</template>
