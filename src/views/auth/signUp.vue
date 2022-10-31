<template>
  <div
    class="container"
    :class="{ right_panel_active: switchMode }"
    id="container"
  >
    <div class="form">
      <div class="form-container sign-up-container">
        <form @submit.prevent="submitForm">
          <h1>Create Account</h1>
          <span>Fill these data fields</span>
          <input
            type="name"
            placeholder="First Name"
            v-model.trim="firstName.val"
            @blur="clearValidity('firstName')"
            :class="{ invalid: !firstName.isValid }"
          />
          <p class="alert" v-if="!firstName.isValid">
            Please enter your first name
          </p>
          <input
            type="name"
            placeholder="Last Name"
            v-model.trim="lastName.val"
            @blur="clearValidity('lastName')"
            :class="{ invalid: !lastName.isValid }"
          />
          <p class="alert" v-if="!lastName.isValid">
            Please enter your last name
          </p>
          <input
            type="text"
            placeholder="Email"
            v-model.trim="email.val"
            @blur="clearValidity('email')"
            :class="{ invalid: !email.isValid }"
          />
          <p class="alert" v-if="!email.isValid">
            Please enter valid email! (which also contains @ symbol )
          </p>
          <input
            type="password"
            placeholder="Password"
            v-model.trim="password.val"
            @blur="clearValidity('password')"
            :class="{ invalid: !password.isValid }"
          />
          <p class="alert" v-if="!password.isValid">
            Please enter valid pasword! (must be at least 6 characters long)
          </p>
          <h3 v-if="error">{{ error }}</h3>
          <button>Sign Up</button>
          <base-spinner v-if="isLoading"></base-spinner>
        </form>
      </div>

      <div class="form-container sign-in-container">
        <form @submit.prevent="submitForm" v-if="!showPopup">
          <h1>Sign in</h1>
          <span>Use your account</span>
          <input
            type="text"
            placeholder="Email"
            v-model.trim="email.val"
            @blur="clearValidity('email')"
            :class="{ invalid: !email.isValid }"
          />
          <p class="alert" v-if="!email.isValid">
            Please enter valid email! (which also contains @ symbol )
          </p>
          <input
            type="password"
            placeholder="Password"
            v-model.trim="password.val"
            @blur="clearValidity('password')"
            :class="{ invalid: !password.isValid }"
          />
          <p class="alert" v-if="!password.isValid">
            Please enter valid pasword! (must be at least 6 characters long)
          </p>
          <!-- <a href="#" @click="resetPass" v-if="showForgotBtn"
          >Forgot your password?</a
        > -->
          <h3 v-if="error">{{ error }}</h3>
          <button v-if="!isLoading">Sign In</button>
          <base-spinner v-if="isLoading"></base-spinner>
        </form>

        <!-- <form @submit.prevent="setPassword" v-else>
        <h1>Change Password</h1>
        <span>Use your email account</span>
        <input type="email" placeholder="Email" v-model.trim="email.val" />
        <p class="alert" v-if="!email.isValid">
          Please enter valid email! (which also contains @ symbol )
        </p>
        <input
          type="password"
          placeholder="Password"
          v-model.trim="password.val"
          @blur="clearValidity('password')"
          :class="{ invalid: !password.isValid }"
        />
        <p class="alert" v-if="!password.isValid">
          Please enter valid pasword! (must be at least 6 characters long)
        </p>
        <button>Confirm Password</button>
      </form> -->
      </div>

      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button class="ghost" id="signIn" @click="signInButton">
              Sign In
            </button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button class="ghost" id="signUp" @click="signUpButton">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseSpinner from "../../components/UI/BaseSpinner.vue";

import { setDoc, doc, getDoc } from "@firebase/firestore";

import {
  db,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../../firebase";

export default {
  components: {
    BaseSpinner,
  },
  data() {
    return {
      switchMode: true,
      firstName: {
        val: "",
        isValid: true,
      },
      lastName: {
        val: "",
        isValid: true,
      },
      email: {
        val: "",
        isValid: true,
      },
      password: {
        val: "",
        isValid: true,
      },
      formIsValid: true,
      mode: "login",
      showPopup: false,
      isLoading: false,
      error: null,
      uid: null,
    };
  },
  computed: {
    showForgotBtn() {
      return this.$store.getters.wPassword;
    },
  },
  methods: {
    clearValidity(input) {
      this[input].isValid = true;
    },
    validateForm() {
      this.formIsValid = true;
      if (this.switchMode) {
        if (this.firstName.val === "") {
          this.firstName.isValid = false;
          this.formIsValid = false;
        }
        if (this.lastName.val === "") {
          this.lastName.isValid = false;
          this.formIsValid = false;
        }
      }
      if (this.email.val === "" || !this.email.val.includes("@")) {
        this.email.isValid = false;
        this.formIsValid = false;
      }
      if (this.password.val.length < 6) {
        this.password.isValid = false;
        this.formIsValid = false;
      }
    },

    async authRegister() {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email.val,
          this.password.val
        );
        const user = userCredential.user;
        return user;
      } catch (err) {
        this.error = err.message || "Failed to login, due to some error!";
      }
    },

    async authSignIn() {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        this.email.val,
        this.password.val
      );
      this.uid = userCredential.user.uid;

      const docRef = doc(db, "Users", this.uid);
      const user = await getDoc(docRef);
      if (user.exists()) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            firstName: user.data().firstName,
            lastName: user.data().lastName,
            email: user.data().email,
            address: user.data().address,
            bio: user.data().bio,
            date: user.data().dateOfBirth,
            imgUrl: user.data().imgUrl,
            phoneNumber: user.data().phoneNumber,
            userId: this.uid,
          })
        );
        let userInfo = {
          firstName: user.data().firstName,
          lastName: user.data().lastName,
        }
        this.$store.dispatch('changeInfo', userInfo)
        this.$router.push("/");
      }
    },

    async submitForm() {
      this.validateForm();
      this.showPopup = false;
      this.error = null;

      if (!this.formIsValid) {
        return;
      }

      this.isLoading = true;

      if (this.switchMode) {
        // this if for signUp
        try {
          const user = await this.authRegister();
          if (user && user.uid) {
            let userInfo = {
            firstName: this.firstName.val,
            lastName: this.lastName.val,
            email: this.email.val,
            password: this.password.val,
            dateOfBirth: null,
            phoneNumber: null,
            address: null,
            bio: null,
          };

            const userRef = doc(db, "Users", user.uid);
            const addedDoc = await setDoc(userRef, userInfo);
            console.log(addedDoc);

            localStorage.setItem(
              "user",
              JSON.stringify({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                address: null,
                phoneNumber: null,
                dateOfBirth: null,
                bio: null,
                userId: user.uid,
              })
            );
            userInfo = {
              firstName: this.firstName.val,
              lastName: this.lastName.val,
            }
            this.$store.dispatch('changeInfo', userInfo)
            this.$router.push("/");
            this.$store.dispatch("changeLoginPopUp");
          }
        } catch (err) {
          this.error = err.message || "Failed to login, due to some error!";
        }
      } else {
        // this else for signIn
        try {
          await this.authSignIn();
          this.$store.dispatch("changeLoginPopUp");
        } catch (err) {
          this.error = err.message || "Failed to login, due to some error!";
        }
      }

      this.isLoading = false;
    },
    signUpButton() {
      this.switchMode = true;
      this.formIsValid = true;
      this.firstName.val = "";
      this.firstName.isValid = true;
      this.lastName.val = "";
      this.lastName.isValid = true;
      this.email.val = "";
      this.email.isValid = true;
      this.password.val = "";
      this.password.isValid = true;
      this.isLoading = false;
      this.error = null;
    },
    signInButton() {
      this.switchMode = false;
      this.formIsValid = true;
      this.firstName.val = "";
      this.firstName.isValid = true;
      this.lastName.val = "";
      this.lastName.isValid = true;
      this.email.val = "";
      this.email.isValid = true;
      this.password.val = "";
      this.password.isValid = true;
      this.isLoading = false;
      this.error = null;
    },
    resetPass() {
      this.showPopup = true;
      this.formIsValid = true;
      this.email.val = "";
      this.email.isValid = true;
      this.password.val = "";
      this.password.isValid = true;
    },
    setPassword() {
      this.validateForm();

      if (!this.formIsValid) {
        return;
      }

      const actionPayload = {
        email: this.email.val,
        password: this.password.val,
      };

      this.$store.dispatch("setPassword", actionPayload);
    },
  },
};
</script>

<style scoped>
h1 {
  font-weight: bold;
  margin: 0;
}

h2 {
  text-align: center;
}

h3 {
  font-size: 1rem;
  font-weight: 400;
  color: red;
  margin-top: 2px;
  padding: 0px 20px;
}

.alert {
  color: red;
  margin: -5px 2px;
  margin-bottom: 10px;
  font-size: 13px;
}

span {
  font-size: 12px;
}

a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

button {
  border-radius: 20px;
  border: 1px solid white;
  background: linear-gradient(to right, rgb(58, 195, 177), rgb(47, 208, 111));
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.ghost {
  background-color: white;
  border-color: #ffffff;
}

form {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

input {
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
}

.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  max-width: 73%;
  /* margin: 25px 3rem; */
  min-height: 480px;
  margin-top: 50px;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right_panel_active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right_panel_active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right_panel_active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: #ff416c;
  /* background: -webkit-linear-gradient(to right, #ff4b2b, #ff416c); */
  background: linear-gradient(to right, rgb(58, 195, 177), rgb(47, 208, 111));
  /* background: linear-gradient(to right, #ff4b2b, #ff416c); */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.right_panel_active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-panel h1,
p,
button {
  margin-bottom: 14px;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right_panel_active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right_panel_active .overlay-right {
  transform: translateX(20%);
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #dddddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}

footer {
  background-color: #222;
  color: #fff;
  font-size: 14px;
  bottom: 0;
  position: fixed;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 999;
}

footer p {
  margin: 10px 0;
}

footer i {
  color: red;
}

footer a {
  color: #3c97bf;
  text-decoration: none;
}

.invalid {
  border: 2px solid red;
  border-radius: 4px;
}

@media (max-width: 921px) {
  .container {
    width: 350px;
  }

  .overlay-container {
    display: none;
  }

  .sign-in-container {
    width: 100%;
  }
}
</style>