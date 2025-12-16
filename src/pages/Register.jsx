import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(
        "https://blomengdalis-tester.com/backend/signup.php",
        {
          email,
          password,
          country,
        }
      );

      if (response.data.success) {
        setMessage('✅ تم التسجيل بنجاح. يمكنك تسجيل الدخول الآن.');
        setEmail('');
        setPassword('');
        setCountry('');
      } else {
        setMessage('⚠️ ' + response.data.message);
      }
    } catch (error) {
      setMessage('⚠️ خطأ في الاتصال بالخادم');
    }
  };

  return (
    <div className="register-form">
      <h2>إنشاء حساب جديد</h2>
      <form onSubmit={handleRegister}>
        <label>
          البريد الإلكتروني:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          كلمة المرور:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          البلد:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>

        <button type="submit">إنشاء الحساب</button>
      </form>

      {message && <p>{message}</p>}
      <p>لدي حساب بالفعل <Link to={'/LoginForm'}> تسجيل الدخول</Link > </p>
       </div>
  );
}

export default Register;
