import { useState } from 'react';
import './Register.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { postRegister } from '../../services/apiServices';
import Language from '../Header/Languge';
import ReCAPTCHA from 'react-google-recaptcha'; // Import ReCAPTCHA

const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState(null); // State lưu giá trị của reCAPTCHA
  const [isShowPassword, setIsShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // Hàm kiểm tra mật khẩu mạnh
  const isStrongPassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleRegister = async () => {
    // Validate email and password
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      toast.error('Invalid email');
      return;
    }
    if (!isStrongPassword(password)) {
      toast.error(
        'Mật khẩu phải dài ít nhất 8 ký tự, bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt'
      );
      return;
    }

    if (!recaptchaValue) {
      toast.error('Please verify you are not a robot');
      return;
    }

    // Submit registration API
    let data = await postRegister(email, password, username);
    if (data && data.EC === 0) {
      toast.success(data.EM);
      navigate('/login');
    }

    if (data && +data.EC !== 0) {
      toast.error(data.EM);
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value); // Lưu giá trị của reCAPTCHA
  };

  return (
    <div className="register-container">
      <div className="header">
        <span> Already have an account?</span>
        <button onClick={() => navigate('/login')}>Log in</button>
        <Language />
      </div>
      <div className="title col-4 mx-auto">Welcome you &amp; go Quiz</div>
      <div className="welcome col-4 mx-auto">Start your journey?</div>
      <div className="content-form col-4 mx-auto">
        <div className="form-group">
          <label>Email (*)</label>
          <input
            type={'email'}
            className="form-control"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="form-group pass-group">
          <label>Password (*)</label>
          <input
            type={isShowPassword ? 'text' : 'password'}
            className="form-control"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {isShowPassword ? (
            <span className="icons-eye" onClick={() => setIsShowPassword(false)}>
              <VscEye />
            </span>
          ) : (
            <span className="icons-eye" onClick={() => setIsShowPassword(true)}>
              <VscEyeClosed />
            </span>
          )}
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type={'text'}
            className="form-control"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        {/* Thêm Google reCAPTCHA */}
        <div className="recaptcha-container">
          <ReCAPTCHA
            sitekey="6LfIsYcqAAAAAI9PPOlUDAIFOPIg89SejdK-eKoR" // Thay bằng key của bạn từ Google reCAPTCHA
            onChange={handleRecaptchaChange} // Lắng nghe sự kiện thay đổi
          />
        </div>

        <div>
          <button className="btn-submit" onClick={() => handleRegister()}>
            Create my free account
          </button>
        </div>
        <div className="text-center">
          <span
            className="back"
            onClick={() => {
              navigate('/');
            }}
          >
            &#60;&#60; Go to Homepage
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
