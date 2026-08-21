This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
docs/
  CHANGELOG.md
public/
  favicon.svg
  icons.svg
src/
  api/
    axios.js
    fetcher.js
  assets/
    hero.png
    react.svg
    vite.svg
  components/
    CommitteeModal.jsx
    DocumentModal.jsx
    EventModal.jsx
    FinanceModal.jsx
    MeetingModal.jsx
    WarningModal.jsx
  contexts/
    AuthContext.jsx
    ThemeContext.jsx
  layouts/
    DashboardLayout.jsx
  pages/
    Dashboard.jsx
    Document.jsx
    EventManagement.jsx
    Finance.jsx
    Login.jsx
    Meeting.jsx
    Warning.jsx
  routes/
    ProtectedRoute.jsx
  App.jsx
  index.css
  main.jsx
.gitignore
.oxlintrc.json
index.html
package.json
README.md
tailwind.config.js
vite.config.js
```

# Files

## File: public/favicon.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="46" fill="none" viewBox="0 0 48 46"><path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" style="fill:#863bff;fill:color(display-p3 .5252 .23 1);fill-opacity:1"/><mask id="a" width="48" height="46" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M25.842 44.938c-.664.844-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.183c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.498 0-3.579-1.842-3.579H1.133c-.92 0-1.456-1.04-.92-1.787L9.91.473c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.578 1.842 3.578h11.377c.943 0 1.473 1.088.89 1.832L25.843 44.94z" style="fill:#000;fill-opacity:1"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#ede6ff" rx="5.508" ry="14.704" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -4.47 31.516)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#ede6ff" rx="10.399" ry="29.851" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -39.328 7.883)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#7e14ff" rx="5.508" ry="30.487" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -25.913 -14.639)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -32.644 -3.334)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -34.34 30.47)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#ede6ff" rx="14.072" ry="22.078" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="rotate(93.35 24.506 48.493)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx=".387" cy="8.972" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(39.51 .387 8.972)"/></g><g filter="url(#k)"><ellipse cx="47.523" cy="-6.092" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 47.523 -6.092)"/></g><g filter="url(#l)"><ellipse cx="41.412" cy="6.333" fill="#47bfff" rx="5.971" ry="9.665" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 41.412 6.333)"/></g><g filter="url(#m)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#n)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#o)"><ellipse cx="35.651" cy="29.907" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 35.651 29.907)"/></g><g filter="url(#p)"><ellipse cx="38.418" cy="32.4" fill="#47bfff" rx="5.971" ry="15.297" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 38.418 32.4)"/></g></g><defs><filter id="b" width="60.045" height="41.654" x="-19.77" y="16.149" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-54.613" y="-7.533" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-49.64" y="2.03" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-45.045" y="20.029" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-43.513" y="21.178" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="15.756" y="-17.901" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-27.636" y="-22.853" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="20.116" y="-38.415" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="24.641" y="-11.323" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="8.244" y="-2.416" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="18.713" y="10.588" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter></defs></svg>
```

## File: public/icons.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="bluesky-icon" viewBox="0 0 16 17">
    <g clip-path="url(#bluesky-clip)"><path fill="#08060d" d="M7.75 7.735c-.693-1.348-2.58-3.86-4.334-5.097-1.68-1.187-2.32-.981-2.74-.79C.188 2.065.1 2.812.1 3.251s.241 3.602.398 4.13c.52 1.744 2.367 2.333 4.07 2.145-2.495.37-4.71 1.278-1.805 4.512 3.196 3.309 4.38-.71 4.987-2.746.608 2.036 1.307 5.91 4.93 2.746 2.72-2.746.747-4.143-1.747-4.512 1.702.189 3.55-.4 4.07-2.145.156-.528.397-3.691.397-4.13s-.088-1.186-.575-1.406c-.42-.19-1.06-.395-2.741.79-1.755 1.24-3.64 3.752-4.334 5.099"/></g>
    <defs><clipPath id="bluesky-clip"><path fill="#fff" d="M.1.85h15.3v15.3H.1z"/></clipPath></defs>
  </symbol>
  <symbol id="discord-icon" viewBox="0 0 20 19">
    <path fill="#08060d" d="M16.224 3.768a14.5 14.5 0 0 0-3.67-1.153c-.158.286-.343.67-.47.976a13.5 13.5 0 0 0-4.067 0c-.128-.306-.317-.69-.476-.976A14.4 14.4 0 0 0 3.868 3.77C1.546 7.28.916 10.703 1.231 14.077a14.7 14.7 0 0 0 4.5 2.306q.545-.748.965-1.587a9.5 9.5 0 0 1-1.518-.74q.191-.14.372-.293c2.927 1.369 6.107 1.369 8.999 0q.183.152.372.294-.723.437-1.52.74.418.838.963 1.588a14.6 14.6 0 0 0 4.504-2.308c.37-3.911-.63-7.302-2.644-10.309m-9.13 8.234c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.894 0 1.614.82 1.599 1.82.001 1-.705 1.82-1.6 1.82m5.91 0c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.893 0 1.614.82 1.599 1.82 0 1-.706 1.82-1.6 1.82"/>
  </symbol>
  <symbol id="documentation-icon" viewBox="0 0 21 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="m15.5 13.333 1.533 1.322c.645.555.967.833.967 1.178s-.322.623-.967 1.179L15.5 18.333m-3.333-5-1.534 1.322c-.644.555-.966.833-.966 1.178s.322.623.966 1.179l1.534 1.321"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M17.167 10.836v-4.32c0-1.41 0-2.117-.224-2.68-.359-.906-1.118-1.621-2.08-1.96-.599-.21-1.349-.21-2.848-.21-2.623 0-3.935 0-4.983.369-1.684.591-3.013 1.842-3.641 3.428C3 6.449 3 7.684 3 10.154v2.122c0 2.558 0 3.838.706 4.726q.306.383.713.671c.76.536 1.79.64 3.581.66"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M3 10a2.78 2.78 0 0 1 2.778-2.778c.555 0 1.209.097 1.748-.047.48-.129.854-.503.982-.982.145-.54.048-1.194.048-1.749a2.78 2.78 0 0 1 2.777-2.777"/>
  </symbol>
  <symbol id="github-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clip-rule="evenodd"/>
  </symbol>
  <symbol id="social-icon" viewBox="0 0 20 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M12.5 6.667a4.167 4.167 0 1 0-8.334 0 4.167 4.167 0 0 0 8.334 0"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M2.5 16.667a5.833 5.833 0 0 1 8.75-5.053m3.837.474.513 1.035c.07.144.257.282.414.309l.93.155c.596.1.736.536.307.965l-.723.73a.64.64 0 0 0-.152.531l.207.903c.164.715-.213.991-.84.618l-.872-.52a.63.63 0 0 0-.577 0l-.872.52c-.624.373-1.003.094-.84-.618l.207-.903a.64.64 0 0 0-.152-.532l-.723-.729c-.426-.43-.289-.864.306-.964l.93-.156a.64.64 0 0 0 .412-.31l.513-1.034c.28-.562.735-.562 1.012 0"/>
  </symbol>
  <symbol id="x-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clip-rule="evenodd"/>
  </symbol>
</svg>
```

## File: src/api/axios.js
```javascript
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    withXSRFToken: true, // INI KUNCI UTAMANYA UNTUK AXIOS VERSI TERBARU!
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Jika error 401/419 dan user TIDAK sedang berada di halaman login
        if ((error.response?.status === 401 || error.response?.status === 419) && window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
```

## File: src/assets/react.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
```

## File: src/assets/vite.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="77" height="47" fill="none" aria-labelledby="vite-logo-title" viewBox="0 0 77 47"><title id="vite-logo-title">Vite</title><style>.parenthesis{fill:#000}@media (prefers-color-scheme:dark){.parenthesis{fill:#fff}}</style><path fill="#9135ff" d="M40.151 45.71c-.663.844-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.493c-.92 0-1.457-1.04-.92-1.788l7.479-10.471c1.07-1.498 0-3.578-1.842-3.578H15.443c-.92 0-1.456-1.04-.92-1.788l9.696-13.576c.213-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.472c-1.07 1.497 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.087.89 1.83L40.153 45.712z"/><mask id="a" width="48" height="47" x="14" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M40.047 45.71c-.663.843-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.389c-.92 0-1.457-1.04-.92-1.788l7.479-10.472c1.07-1.497 0-3.578-1.842-3.578H15.34c-.92 0-1.456-1.04-.92-1.788l9.696-13.575c.213-.297.556-.474.92-.474H53.93c.92 0 1.456 1.04.92 1.788L47.37 13.03c-1.07 1.498 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.088.89 1.831L40.049 45.712z"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#eee6ff" rx="5.508" ry="14.704" transform="rotate(269.814 20.96 11.29)scale(-1 1)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#eee6ff" rx="10.399" ry="29.851" transform="rotate(89.814 -16.902 -8.275)scale(1 -1)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#8900ff" rx="5.508" ry="30.487" transform="rotate(89.814 -19.197 -7.127)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.928 4.177)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.738 5.52)scale(1 -1)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#eee6ff" rx="14.072" ry="22.078" transform="rotate(93.35 31.245 55.578)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx="14.592" cy="9.743" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(39.51 14.592 9.743)"/></g><g filter="url(#k)"><ellipse cx="61.728" cy="-5.321" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 61.728 -5.32)"/></g><g filter="url(#l)"><ellipse cx="55.618" cy="7.104" fill="#00c2ff" rx="5.971" ry="9.665" transform="rotate(37.892 55.618 7.104)"/></g><g filter="url(#m)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#n)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#o)"><ellipse cx="49.857" cy="30.678" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 49.857 30.678)"/></g><g filter="url(#p)"><ellipse cx="52.623" cy="33.171" fill="#00c2ff" rx="5.971" ry="15.297" transform="rotate(37.892 52.623 33.17)"/></g></g><path d="M6.919 0c-9.198 13.166-9.252 33.575 0 46.789h6.215c-9.25-13.214-9.196-33.623 0-46.789zm62.424 0h-6.215c9.198 13.166 9.252 33.575 0 46.789h6.215c9.25-13.214 9.196-33.623 0-46.789" class="parenthesis"/><defs><filter id="b" width="60.045" height="41.654" x="-5.564" y="16.92" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-40.407" y="-6.762" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-35.435" y="2.801" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-30.84" y="20.8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-29.307" y="21.949" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="29.961" y="-17.13" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-13.43" y="-22.082" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="34.321" y="-37.644" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="38.847" y="-10.552" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="22.45" y="-1.645" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="32.919" y="11.36" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter></defs></svg>
```

## File: src/components/EventModal.jsx
```javascript
import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const initialForm = {
  name: '',
  description: '',
  budget_approved: '',
  drive_folder_url: '',
  start_date: '',
  end_date: '',
};

export default function EventModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        budget_approved: initialData.budget_approved ?? '',
        drive_folder_url: initialData.drive_folder_url || '',
        start_date: initialData.start_date ? initialData.start_date.substring(0, 10) : '',
        end_date: initialData.end_date ? initialData.end_date.substring(0, 10) : '',
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        budget_approved: form.budget_approved !== '' ? Number(form.budget_approved) : 0,
        drive_folder_url: form.drive_folder_url || null,
        start_date: form.start_date,
        end_date: form.end_date || null,
      };

      if (initialData?.id) {
        await api.put(`/api/events/${initialData.id}`, payload);
        toast.success('Event berhasil diperbarui.');
      } else {
        await api.post('/api/events', payload);
        toast.success('Event berhasil ditambahkan.');
      }

      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.message) {
          toast.error(data.message);
        }
        if (data.errors) {
          setErrors(data.errors);
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError && !data.message) {
            toast.error(firstError);
          }
        }
      } else {
        toast.error(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = initialData?.id ? 'Edit Event' : 'Tambah Event';

  const inputClass = (field) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none backdrop-blur-sm transition-all duration-200 focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:disabled:bg-white/5 dark:disabled:text-slate-500 ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-white/10'
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nama Event <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Workshop Web Development 2026"
              className={inputClass('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name[0]}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Deskripsi Event
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Jelaskan gambaran umum atau tujuan event..."
              rows={3}
              className={inputClass('description') + ' resize-none'}
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description[0]}</p>}
          </div>

          {/* Budget Approved */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Anggaran Disetujui (Rp)
            </label>
            <input
              type="number"
              name="budget_approved"
              value={form.budget_approved}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={inputClass('budget_approved')}
            />
            {errors.budget_approved && <p className="mt-1 text-xs text-red-400">{errors.budget_approved[0]}</p>}
          </div>

          {/* Dates (Start & End) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className={inputClass('start_date')}
              />
              {errors.start_date && <p className="mt-1 text-xs text-red-400">{errors.start_date[0]}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tanggal Selesai
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className={inputClass('end_date')}
              />
              {errors.end_date && <p className="mt-1 text-xs text-red-400">{errors.end_date[0]}</p>}
            </div>
          </div>

          {/* Drive Folder URL */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tautan Folder Drive (Opsional)
            </label>
            <input
              type="url"
              name="drive_folder_url"
              value={form.drive_folder_url}
              onChange={handleChange}
              placeholder="https://drive.google.com/drive/folders/..."
              className={inputClass('drive_folder_url')}
            />
            {errors.drive_folder_url && <p className="mt-1 text-xs text-red-400">{errors.drive_folder_url[0]}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## File: src/contexts/AuthContext.jsx
```javascript
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/api/user');
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    await api.get('/sanctum/csrf-cookie');
    await api.post('/login', { email, password });
    await checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    await api.post('/logout');
    setUser(null);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## File: src/contexts/ThemeContext.jsx
```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

## File: src/pages/EventManagement.jsx
```javascript
import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import EventModal from '../components/EventModal';
import CommitteeModal from '../components/CommitteeModal';
import {
  CalendarRange,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ShieldAlert,
  Users,
  Pencil,
  Trash2,
  Calendar,
  ExternalLink,
} from 'lucide-react';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID });
  } catch {
    return dateStr;
  }
}

export default function EventManagement() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [committeeModalOpen, setCommitteeModalOpen] = useState(false);
  const [committeeTargetEvent, setCommitteeTargetEvent] = useState(null);

  const isAdmin = user?.roles?.[0]?.name === 'admin';

  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
    mutate: mutateEvents,
  } = useSWR(isAdmin ? `/api/events?page=${page}` : null, paginatedFetcher);

  // RBAC Access Control Guard
  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 px-8 py-8 text-center dark:bg-red-500/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 text-red-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-700 dark:text-red-300">Akses Ditolak</h2>
            <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">
              Halaman ini hanya dapat diakses oleh Administrator BPH Pusat.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (eventsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat manajemen event...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (eventsError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 px-8 py-6 dark:bg-red-500/10">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat event</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">
              Terjadi kesalahan saat mengambil daftar event dari server.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const eventsList =
    eventsData?.data?.data || (Array.isArray(eventsData?.data) ? eventsData.data : []) || [];
  const meta =
    eventsData?.meta ||
    (eventsData?.data && !Array.isArray(eventsData?.data) ? eventsData.data : null);

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Yakin ingin menghapus event ini beserta data terkaitnya?')) {
      try {
        await api.delete(`/api/events/${id}`);
        toast.success('Event berhasil dihapus.');
        mutateEvents();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal menghapus event.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
            <CalendarRange className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Manajemen Event</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta?.total ?? eventsList.length} event terdaftar dalam sistem
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedEvent(null);
            setEventModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30"
        >
          <Plus className="h-4 w-4" />
          Tambah Event
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Nama Event
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Tanggal Pelaksanaan
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Anggaran Disetujui
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {eventsList.length > 0 ? (
                eventsList.map((item) => {
                  const startDate = item.start_date || item.date;
                  const endDate = item.end_date;

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      {/* Name & Description */}
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {item.description}
                            </p>
                          )}
                          {item.drive_folder_url && (
                            <a
                              href={item.drive_folder_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:underline dark:text-primary-400"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Folder Drive
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Date Range */}
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          <span>
                            {formatTanggal(startDate)}
                            {endDate && ` — ${formatTanggal(endDate)}`}
                          </span>
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(item.budget_approved)}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Panitia Button */}
                          <button
                            onClick={() => {
                              setCommitteeTargetEvent(item);
                              setCommitteeModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100 hover:text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300"
                          >
                            <Users className="h-3.5 w-3.5" />
                            Panitia
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setSelectedEvent(item);
                              setEventModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteEvent(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                  >
                    Belum ada data event terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Halaman {meta.current_page} dari {meta.last_page}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.last_page || !eventsData?.links?.next}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Event CRUD Modal */}
      <EventModal
        isOpen={eventModalOpen}
        onClose={() => {
          setEventModalOpen(false);
          setSelectedEvent(null);
        }}
        onSuccess={() => mutateEvents()}
        initialData={selectedEvent}
      />

      {/* Committee Injection Modal */}
      <CommitteeModal
        isOpen={committeeModalOpen}
        onClose={() => {
          setCommitteeModalOpen(false);
          setCommitteeTargetEvent(null);
        }}
        event={committeeTargetEvent}
      />
    </div>
  );
}
```

## File: src/pages/Login.jsx
```javascript
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        'Login gagal. Periksa kembali kredensial Anda.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 shadow-lg shadow-primary-500/25">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Selamat Datang Kembali
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
        >
          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Masuk
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Manajemen Protik. All rights reserved.
        </p>
      </div>
    </div>
  );
}
```

## File: src/routes/ProtectedRoute.jsx
```javascript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

## File: src/main.jsx
```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## File: .gitignore
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

## File: .oxlintrc.json
```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

## File: index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistem Manajemen Protik — Kelola data protik dengan efisien" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>Manajemen Protik</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## File: README.md
```markdown
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
```

## File: tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## File: vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## File: src/api/fetcher.js
```javascript
import api from './axios';

export const fetcher = (url) => api.get(url).then((res) => res.data.data);

export const paginatedFetcher = (url) => api.get(url).then((res) => res.data);
```

## File: src/components/CommitteeModal.jsx
```javascript
import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import * as XLSX from 'xlsx';
import {
  X,
  Loader2,
  Download,
  Upload,
  Trash2,
  Search,
  Users,
  Plus,
  FileSpreadsheet,
} from 'lucide-react';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CommitteeModal({ isOpen, onClose, event }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [position, setPosition] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch Users
  const { data: usersData, isLoading: usersLoading } = useSWR(
    isOpen ? '/api/users' : null,
    paginatedFetcher
  );

  // Fetch Committees for active event
  const committeeUrl =
    isOpen && event?.id ? `/api/event-committees?event_id=${event.id}` : null;
  const {
    data: committeesData,
    isLoading: committeeLoading,
    mutate: mutateCommittees,
  } = useSWR(committeeUrl, paginatedFetcher);

  // Close combobox when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset state when modal closes or active event changes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedUserId(null);
      setPosition('');
      setIsDropdownOpen(false);
      setIsUploading(false);
      setSubmitting(false);
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const usersList =
    usersData?.data?.data ||
    (Array.isArray(usersData?.data) ? usersData.data : []) ||
    [];
  const committeesList =
    committeesData?.data?.data ||
    (Array.isArray(committeesData?.data) ? committeesData.data : []) ||
    [];

  const filteredUsers = usersList.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  // TUGAS 3: Fitur Excel Multi-Sheet (Download Template)
  const handleDownloadTemplate = () => {
    try {
      // Sheet 1: Form_Import
      const formImportData = [
        {
          'ID Anggota': '',
          'Jabatan': '',
        },
      ];
      const wsForm = XLSX.utils.json_to_sheet(formImportData);

      // Sheet 2: Referensi_Anggota
      const referenceData = usersList.map((u) => ({
        'ID Anggota': u.id,
        'Nama Anggota': u.name,
        'Email': u.email,
      }));
      const wsRef = XLSX.utils.json_to_sheet(referenceData);

      // Sheet 3: Panduan_Sistem
      const guideData = [
        {
          'ATURAN PENGISIAN PANITIA':
            '1. Gunakan ID Anggota yang valid dari Sheet Referensi_Anggota.',
        },
        {
          'ATURAN PENGISIAN PANITIA':
            '2. Untuk akses Edit (Keuangan/Dokumen/Rapat), ketik Jabatan PERSIS: Ketua, Sekretaris, atau Bendahara.',
        },
        {
          'ATURAN PENGISIAN PANITIA':
            '3. Untuk divisi lain, ketik bebas (misal: Koordinator Acara).',
        },
      ];
      const wsGuide = XLSX.utils.json_to_sheet(guideData);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsForm, 'Form_Import');
      XLSX.utils.book_append_sheet(wb, wsRef, 'Referensi_Anggota');
      XLSX.utils.book_append_sheet(wb, wsGuide, 'Panduan_Sistem');

      XLSX.writeFile(wb, 'Template_Panitia.xlsx');
      toast.success('Template Panitia berhasil diunduh.');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunduh template.');
    }
  };

  // TUGAS 4: Fitur Excel (Bulk Import)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const data = evt.target?.result;
        const wb = XLSX.read(data, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);

        if (!rows || rows.length === 0) {
          toast.error('File Excel kosong atau format tidak sesuai.');
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        let successCount = 0;
        let failCount = 0;

        for (const row of rows) {
          const rawUserId = row['ID Anggota'];
          const rawPosition = row['Jabatan'];

          if (!rawUserId || !rawPosition) {
            failCount++;
            continue;
          }

          try {
            await api.post('/api/event-committees', {
              event_id: event.id,
              user_id: Number(rawUserId),
              position: String(rawPosition).trim(),
            });
            successCount++;
          } catch (itemErr) {
            console.error('Error importing row:', row, itemErr);
            toast.error(
              itemErr.response?.data?.message ||
                `Gagal mengimpor anggota ID ${rawUserId}`
            );
            failCount++;
          }
        }

        if (successCount > 0) {
          toast.success(`Berhasil mengimpor ${successCount} panitia.`);
        }
        mutateCommittees();
      } catch (err) {
        console.error(err);
        toast.error('Terjadi kesalahan saat memproses file Excel.');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      toast.error('Gagal membaca file Excel.');
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsBinaryString(file);
  };

  // Submit Injeksi Manual
  const handleAddCommittee = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Silakan cari dan pilih anggota terlebih dahulu.');
      return;
    }
    if (!position.trim()) {
      toast.error('Silakan isi atau pilih jabatan.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/event-committees', {
        event_id: event.id,
        user_id: selectedUserId,
        position: position.trim(),
      });

      toast.success('Panitia berhasil ditambahkan.');
      setSelectedUserId(null);
      setSearchTerm('');
      setPosition('');
      mutateCommittees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menambahkan panitia.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Committee
  const handleDeleteCommittee = async (id) => {
    if (window.confirm('Yakin ingin menghapus panitia ini?')) {
      setDeletingId(id);
      try {
        await api.delete(`/api/event-committees/${id}`);
        toast.success('Panitia berhasil dihapus.');
        mutateCommittees();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal menghapus panitia.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getPositionBadge = (pos) => {
    switch (pos) {
      case 'Ketua':
        return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
      case 'Bendahara':
        return 'bg-amber-500/15 text-amber-600 border-amber-500/20 dark:text-amber-400';
      case 'Sekretaris':
        return 'bg-violet-500/15 text-violet-600 border-violet-500/20 dark:text-violet-400';
      default:
        return 'bg-primary-500/15 text-primary-600 border-primary-500/20 dark:text-primary-400';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md shadow-indigo-500/25">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Kelola Panitia Event
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {event.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-6 px-6 py-5">
          {/* Action Bar (Unduh Template & Impor Excel) */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Impor Massal Excel
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Tombol Unduh Template */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Unduh Template</span>
              </button>

              {/* Tombol Impor Excel (Hidden Input) */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls"
                className="hidden"
                id="excel-upload-input"
              />
              <label
                htmlFor="excel-upload-input"
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 shadow-sm transition hover:bg-indigo-100 hover:text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 ${
                  isUploading ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                <span>{isUploading ? 'Mengimpor...' : 'Impor Excel'}</span>
              </label>
            </div>
          </div>

          {/* Form Injeksi Manual (Grid 2 Kolom) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Injeksi Panitia Manual
            </h3>
            <form onSubmit={handleAddCommittee} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Kolom Kiri: Pilih Anggota (Combobox Search) */}
                <div className="relative" ref={dropdownRef}>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Pilih Anggota <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedUserId(null);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder={
                        usersLoading
                          ? 'Memuat anggota...'
                          : 'Cari nama atau email...'
                      }
                      disabled={usersLoading}
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-100 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:disabled:bg-white/5"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  </div>

                  {/* Dropdown Hasil Search */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-800">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                          <div
                            key={u.id}
                            onClick={() => {
                              setSelectedUserId(u.id);
                              setSearchTerm(u.name);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex cursor-pointer flex-col px-3.5 py-2 text-xs transition ${
                              selectedUserId === u.id
                                ? 'bg-primary-50 font-semibold text-primary-600 dark:bg-primary-950/50 dark:text-primary-400'
                                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5'
                            }`}
                          >
                            <span className="font-medium">{u.name}</span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                              {u.email}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
                          {usersLoading
                            ? 'Memuat data anggota...'
                            : 'Tidak ada anggota ditemukan.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Kolom Kanan: Jabatan (Datalist Hibrida) */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    list="jabatan-list"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Pilih atau ketik jabatan..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  />
                  <datalist id="jabatan-list">
                    <option value="Ketua" />
                    <option value="Sekretaris" />
                    <option value="Bendahara" />
                    <option value="Koordinator Acara" />
                    <option value="Koordinator Media" />
                    <option value="Koordinator Konsumsi" />
                    <option value="Koordinator Perkap" />
                    <option value="Koordinator Sponsorship" />
                    <option value="Koordinator Humas" />
                    <option value="Anggota Divisi Acara" />
                    <option value="Anggota Divisi Media" />
                    <option value="Anggota Divisi Konsumsi" />
                    <option value="Anggota Divisi Perkap" />
                    <option value="Anggota Divisi Sponsorship" />
                    <option value="Anggota Divisi Humas" />
                  </datalist>
                </div>
              </div>

              {/* Tombol Tambah */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={submitting || !selectedUserId || !position.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition hover:shadow-lg hover:shadow-primary-500/30 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span>Tambah Panitia</span>
                </button>
              </div>
            </form>
          </div>

          {/* Tabel Daftar Panitia Terdaftar */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Daftar Panitia Terdaftar ({committeesList.length})
            </h3>

            {committeeLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                  Memuat data panitia...
                </span>
              </div>
            ) : committeesList.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Nama
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Email
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Jabatan
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {committeesList.map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          {item.user?.name || item.user_name || '-'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                          {item.user?.email || '-'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${getPositionBadge(
                              item.position
                            )}`}
                          >
                            {item.position}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteCommittee(item.id)}
                            disabled={deletingId === item.id}
                            title="Hapus Panitia"
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 p-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 disabled:opacity-40 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-xs text-slate-400 dark:border-white/10 dark:text-slate-500">
                Belum ada panitia yang ditugaskan pada event ini.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 px-6 py-4 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
```

## File: src/components/WarningModal.jsx
```javascript
import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const initialForm = {
  user_id: '',
  reason: '',
  date: '',
};

export default function WarningModal({ isOpen, onClose, onSuccess, currentUserId }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const payload = {
        admin_id: currentUserId,
        user_id: Number(form.user_id),
        reason: form.reason,
        date: form.date,
      };

      await api.post('/api/warnings', payload);
      toast.success('Surat peringatan berhasil ditambahkan.');
      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.message) {
          toast.error(data.message);
        }
        if (data.errors) {
          setErrors(data.errors);
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError && !data.message) {
            toast.error(firstError);
          }
        }
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none backdrop-blur-sm transition-all duration-200 focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:disabled:bg-white/5 dark:disabled:text-slate-500 ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-white/10'
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tambah Surat Peringatan</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* User ID */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ID Anggota
            </label>
            <input
              type="number"
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              placeholder="Masukkan ID anggota"
              min="1"
              className={inputClass('user_id')}
            />
            {errors.user_id && <p className="mt-1 text-xs text-red-400">{errors.user_id[0]}</p>}
          </div>

          {/* Reason */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Alasan Peringatan
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Tuliskan alasan surat peringatan..."
              rows={4}
              className={inputClass('reason') + ' resize-none'}
            />
            {errors.reason && <p className="mt-1 text-xs text-red-400">{errors.reason[0]}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tanggal
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputClass('date')}
            />
            {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date[0]}</p>}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## File: src/pages/Dashboard.jsx
```javascript
import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import {
  Wallet,
  CalendarCheck,
  FileOutput,
  CalendarClock,
  Users,
  TrendingUp,
  AlertCircle,
  Loader2,
} from 'lucide-react';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID });
}

// --- Stat Card ---
function StatCard({ icon: Icon, label, value, gradient, iconBg }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-6 backdrop-blur-xl transition-all duration-300 hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:shadow-2xl">
      {/* Gradient glow */}
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40 ${gradient}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// --- Agenda List ---
function AgendaSection({ title, icon: Icon, items, renderItem, emptyText }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/15 dark:bg-primary-600/20">
          <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {items && items.length > 0 ? (
          items.map(renderItem)
        ) : (
          <div className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">{emptyText}</div>
        )}
      </div>
    </div>
  );
}

// --- Main Dashboard ---
export default function Dashboard() {
  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useSWR('/api/dashboard/statistics', fetcher);

  const {
    data: agenda,
    error: agendaError,
    isLoading: agendaLoading,
  } = useSWR('/api/dashboard/upcoming-agenda', fetcher);

  const isLoading = statsLoading || agendaLoading;
  const error = statsError || agendaError;

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat data</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil data dari server.</p>
          </div>
        </div>
      </div>
    );
  }

  const financial = stats?.financial_health;
  const events = stats?.event_performance;
  const activity = stats?.organizational_activity;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Wallet}
          label="Total Saldo"
          value={formatRupiah(financial?.total_balance)}
          gradient="bg-emerald-500"
          iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
        />
        <StatCard
          icon={CalendarCheck}
          label="Event Aktif"
          value={events?.active_events ?? 0}
          gradient="bg-primary-500"
          iconBg="bg-gradient-to-br from-primary-500 to-primary-700"
        />
        <StatCard
          icon={FileOutput}
          label="Surat Keluar"
          value={activity?.outgoing_letters ?? 0}
          gradient="bg-violet-500"
          iconBg="bg-gradient-to-br from-violet-500 to-violet-700"
        />
      </div>

      {/* Agenda Sections */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Upcoming Events */}
        <AgendaSection
          title="Jadwal Event Terdekat"
          icon={TrendingUp}
          items={agenda?.upcoming_events}
          emptyText="Belum ada event mendatang."
          renderItem={(event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 dark:bg-primary-600/15">
                <CalendarCheck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{event.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatTanggal(event.start_date)}</p>
              </div>
            </div>
          )}
        />

        {/* Upcoming Meetings */}
        <AgendaSection
          title="Jadwal Rapat Terdekat"
          icon={Users}
          items={agenda?.upcoming_meetings}
          emptyText="Belum ada rapat mendatang."
          renderItem={(meeting) => (
            <div
              key={meeting.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 dark:bg-violet-600/15">
                <CalendarClock className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{meeting.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatTanggal(meeting.date)}</p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
```

## File: src/pages/Warning.jsx
```javascript
import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import WarningModal from '../components/WarningModal';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID });
  } catch {
    return dateStr;
  }
}

export default function Warning() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const isAdmin = user?.roles?.[0]?.name === 'admin';

  const { data, error, isLoading, mutate } = useSWR(
    `/api/warnings?page=${page}`,
    paginatedFetcher
  );

  // --- Loading ---
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data peringatan...</p>
        </div>
      </div>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat data</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil data peringatan.</p>
          </div>
        </div>
      </div>
    );
  }

  const warnings = data?.data?.data || (Array.isArray(data?.data) ? data.data : []) || [];
  const meta = data?.meta || (data?.data && !Array.isArray(data?.data) ? data.data : null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/25">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Surat Peringatan</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta?.total ?? warnings.length} peringatan terdaftar
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30"
          >
            <Plus className="h-4 w-4" />
            Tambah Peringatan
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Tanggal
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Nama Anggota
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Alasan
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Dikeluarkan Oleh
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {warnings.length > 0 ? (
                warnings.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {formatTanggal(item.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {item.user?.name ?? '-'}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {item.reason}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        {item.admin?.name ?? '-'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    Belum ada data peringatan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Halaman {meta.current_page} dari {meta.last_page}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.last_page || !data?.links?.next}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <WarningModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => mutate()}
        currentUserId={user?.id}
      />
    </div>
  );
}
```

## File: package.json
```json
{
  "name": "manajemen-protik-ui",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.19.0",
    "date-fns": "^4.4.0",
    "lucide-react": "^1.33.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-hot-toast": "^2.6.0",
    "react-router-dom": "^7.18.2",
    "swr": "^2.5.1",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.4",
    "oxlint": "^1.75.0",
    "tailwindcss": "^4.3.3",
    "vite": "^8.2.0"
  }
}
```

## File: src/components/DocumentModal.jsx
```javascript
import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const initialForm = {
  letter_number: '',
  title: '',
  drive_url: '',
  event_id: '',
};

export default function DocumentModal({
  isOpen,
  onClose,
  onSuccess,
  currentUserId,
  initialData = null,
  isReadOnly = false,
  activeEventId = null,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        letter_number: initialData.letter_number || '',
        title: initialData.title || '',
        drive_url: initialData.drive_url || '',
        event_id: initialData.event_id ?? (activeEventId ?? ''),
      });
    } else {
      setForm({
        ...initialForm,
        event_id: activeEventId ?? '',
      });
    }
    setErrors({});
  }, [initialData, activeEventId, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    setSubmitting(true);
    setErrors({});

    try {
      const targetEventId = initialData
        ? (form.event_id ? Number(form.event_id) : null)
        : (activeEventId ? Number(activeEventId) : (form.event_id ? Number(form.event_id) : null));

      const payload = {
        created_by: currentUserId,
        letter_number: form.letter_number,
        title: form.title,
        drive_url: form.drive_url,
        event_id: targetEventId,
      };

      if (initialData?.id) {
        await api.put(`/api/documents/${initialData.id}`, payload);
        toast.success('Surat berhasil diperbarui.');
      } else {
        await api.post('/api/documents', payload);
        toast.success('Surat berhasil ditambahkan.');
      }

      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.message) {
          toast.error(data.message);
        }
        if (data.errors) {
          setErrors(data.errors);
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError && !data.message) {
            toast.error(firstError);
          }
        }
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = isReadOnly
    ? 'Detail Dokumen'
    : initialData?.id
    ? 'Edit Surat'
    : 'Tambah Surat';

  const inputClass = (field) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none backdrop-blur-sm transition-all duration-200 focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:disabled:bg-white/5 dark:disabled:text-slate-500 ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-white/10'
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Letter Number */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nomor Surat
            </label>
            <input
              type="text"
              name="letter_number"
              value={form.letter_number}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="Contoh: 001/PROTIK/VIII/2026"
              className={inputClass('letter_number')}
            />
            {errors.letter_number && <p className="mt-1 text-xs text-red-400">{errors.letter_number[0]}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Judul Surat
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="Masukkan judul surat"
              className={inputClass('title')}
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title[0]}</p>}
          </div>

          {/* Drive URL */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tautan Dokumen
            </label>
            <input
              type="url"
              name="drive_url"
              value={form.drive_url}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="https://drive.google.com/..."
              className={inputClass('drive_url')}
            />
            {errors.drive_url && <p className="mt-1 text-xs text-red-400">{errors.drive_url[0]}</p>}
          </div>

          {/* Event ID */}
          {!activeEventId && (
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Event ID (Opsional)
              </label>
              <input
                type="text"
                name="event_id"
                value={form.event_id}
                onChange={handleChange}
                disabled={isReadOnly}
                placeholder="Masukkan ID event terkait"
                className={inputClass('event_id')}
              />
              {errors.event_id && <p className="mt-1 text-xs text-red-400">{errors.event_id[0]}</p>}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {isReadOnly ? 'Tutup' : 'Batal'}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
```

## File: src/components/FinanceModal.jsx
```javascript
import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const FUNDING_SOURCES = [
  { value: '', label: 'Pilih Sumber Dana (Opsional)' },
  { value: 'IOM', label: 'IOM' },
  { value: 'DIPA', label: 'DIPA' },
  { value: 'KAS', label: 'KAS' },
  { value: 'SPONSOR', label: 'SPONSOR' },
];

const initialForm = {
  type: 'income',
  amount: '',
  description: '',
  date: '',
  funding_source: '',
  event_id: '',
};

export default function FinanceModal({
  isOpen,
  onClose,
  onSuccess,
  currentUserId,
  initialData = null,
  isReadOnly = false,
  activeEventId = null,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type || 'income',
        amount: initialData.amount ?? '',
        description: initialData.description || '',
        date: initialData.date ? initialData.date.substring(0, 10) : '',
        funding_source: initialData.funding_source || '',
        event_id: initialData.event_id ?? (activeEventId ?? ''),
      });
    } else {
      setForm({
        ...initialForm,
        event_id: activeEventId ?? '',
      });
    }
    setErrors({});
  }, [initialData, activeEventId, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    setSubmitting(true);
    setErrors({});

    try {
      const targetEventId = initialData
        ? (form.event_id ? Number(form.event_id) : null)
        : (activeEventId ? Number(activeEventId) : (form.event_id ? Number(form.event_id) : null));

      const payload = {
        user_id: currentUserId,
        type: form.type,
        amount: Number(form.amount),
        description: form.description,
        date: form.date,
        funding_source: form.funding_source || null,
        event_id: targetEventId,
      };

      if (initialData?.id) {
        await api.put(`/api/finances/${initialData.id}`, payload);
        toast.success('Transaksi berhasil diperbarui.');
      } else {
        await api.post('/api/finances', payload);
        toast.success('Transaksi berhasil ditambahkan.');
      }

      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.message) {
          toast.error(data.message);
        }
        if (data.errors) {
          setErrors(data.errors);
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError && !data.message) {
            toast.error(firstError);
          }
        }
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = isReadOnly
    ? 'Detail Transaksi'
    : initialData?.id
    ? 'Edit Transaksi'
    : 'Tambah Transaksi';

  const inputClass = (field) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none backdrop-blur-sm transition-all duration-200 focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:disabled:bg-white/5 dark:disabled:text-slate-500 ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-white/10'
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Type */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tipe Transaksi
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              disabled={isReadOnly}
              className={inputClass('type')}
            >
              <option value="income" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Pemasukan</option>
              <option value="expense" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Pengeluaran</option>
            </select>
            {errors.type && <p className="mt-1 text-xs text-red-400">{errors.type[0]}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nominal (Rp)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="0"
              min="0"
              className={inputClass('amount')}
            />
            {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount[0]}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Deskripsi
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="Keterangan transaksi"
              className={inputClass('description')}
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description[0]}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tanggal
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              disabled={isReadOnly}
              className={inputClass('date')}
            />
            {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date[0]}</p>}
          </div>

          {/* Funding Source */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sumber Dana
            </label>
            <select
              name="funding_source"
              value={form.funding_source}
              onChange={handleChange}
              disabled={isReadOnly}
              className={inputClass('funding_source')}
            >
              {FUNDING_SOURCES.map((src) => (
                <option key={src.value} value={src.value} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                  {src.label}
                </option>
              ))}
            </select>
            {errors.funding_source && <p className="mt-1 text-xs text-red-400">{errors.funding_source[0]}</p>}
          </div>

          {/* Event ID */}
          {!activeEventId && (
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Event ID (Opsional)
              </label>
              <input
                type="text"
                name="event_id"
                value={form.event_id}
                onChange={handleChange}
                disabled={isReadOnly}
                placeholder="Masukkan ID event terkait"
                className={inputClass('event_id')}
              />
              {errors.event_id && <p className="mt-1 text-xs text-red-400">{errors.event_id[0]}</p>}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {isReadOnly ? 'Tutup' : 'Batal'}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
```

## File: src/components/MeetingModal.jsx
```javascript
import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const initialForm = {
  title: '',
  date: '',
  minutes_url: '',
  event_id: '',
};

function formatForDateTimeInput(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.replace(' ', 'T').substring(0, 16);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return dateStr.replace(' ', 'T').substring(0, 16);
  }
}

export default function MeetingModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
  isReadOnly = false,
  activeEventId = null,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        date: formatForDateTimeInput(initialData.date),
        minutes_url: initialData.minutes_url || '',
        event_id: initialData.event_id ?? (activeEventId ?? ''),
      });
    } else {
      setForm({
        ...initialForm,
        event_id: activeEventId ?? '',
      });
    }
    setErrors({});
  }, [initialData, activeEventId, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    setSubmitting(true);
    setErrors({});

    try {
      const targetEventId = initialData
        ? (form.event_id ? Number(form.event_id) : null)
        : (activeEventId ? Number(activeEventId) : (form.event_id ? Number(form.event_id) : null));

      const payload = {
        title: form.title,
        date: form.date ? form.date.replace('T', ' ') : '',
        minutes_url: form.minutes_url || null,
        event_id: targetEventId,
      };

      if (initialData?.id) {
        await api.put(`/api/meetings/${initialData.id}`, payload);
        toast.success('Rapat berhasil diperbarui.');
      } else {
        await api.post('/api/meetings', payload);
        toast.success('Rapat berhasil ditambahkan.');
      }

      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.message) {
          toast.error(data.message);
        }
        if (data.errors) {
          setErrors(data.errors);
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError && !data.message) {
            toast.error(firstError);
          }
        }
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = isReadOnly
    ? 'Detail Rapat'
    : initialData?.id
    ? 'Edit Rapat'
    : 'Tambah Rapat';

  const inputClass = (field) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none backdrop-blur-sm transition-all duration-200 focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:disabled:bg-white/5 dark:disabled:text-slate-500 ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-white/10'
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Judul Rapat
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="Masukkan judul rapat"
              className={inputClass('title')}
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title[0]}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tanggal & Waktu
            </label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              disabled={isReadOnly}
              className={inputClass('date')}
            />
            {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date[0]}</p>}
          </div>

          {/* Minutes URL */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              URL Notulensi (Opsional)
            </label>
            <input
              type="url"
              name="minutes_url"
              value={form.minutes_url}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="https://docs.google.com/..."
              className={inputClass('minutes_url')}
            />
            {errors.minutes_url && <p className="mt-1 text-xs text-red-400">{errors.minutes_url[0]}</p>}
          </div>

          {/* Event ID */}
          {!activeEventId && (
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Event ID (Opsional)
              </label>
              <input
                type="text"
                name="event_id"
                value={form.event_id}
                onChange={handleChange}
                disabled={isReadOnly}
                placeholder="Masukkan ID event terkait"
                className={inputClass('event_id')}
              />
              {errors.event_id && <p className="mt-1 text-xs text-red-400">{errors.event_id[0]}</p>}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {isReadOnly ? 'Tutup' : 'Batal'}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
```

## File: src/pages/Document.jsx
```javascript
import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import DocumentModal from '../components/DocumentModal';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  FileText,
  ExternalLink,
  ArrowLeft,
  Calendar,
  User,
  Pencil,
  Trash2,
  Eye,
  Layers,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID });
  } catch {
    return dateStr;
  }
}

export default function Document() {
  const { user } = useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isReadOnlyModal, setIsReadOnlyModal] = useState(false);

  // --- Directory Mode: Fetch Events ---
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR(!activeWorkspace ? '/api/events?page=1' : null, paginatedFetcher);

  // --- Workspace Mode: Fetch Documents ---
  const documentUrl = activeWorkspace
    ? activeWorkspace.id
      ? `/api/documents?event_id=${activeWorkspace.id}&page=${page}`
      : `/api/documents?page=${page}`
    : null;

  const {
    data: documentsData,
    error: documentsError,
    isLoading: documentsLoading,
    mutate: mutateDocuments,
  } = useSWR(documentUrl, paginatedFetcher);

  // --- RBAC: Row-Level Authorization ---
  const isGlobalAdmin = user?.roles?.[0]?.name === 'admin';
  const isCommittee = activeWorkspace?.committees?.some(
    (c) => c.user_id === user?.id && ['Ketua', 'Sekretaris'].includes(c.position)
  );
  const canEdit = isGlobalAdmin || (activeWorkspace?.id !== null && isCommittee);

  // --- Delete Handler ---
  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus dokumen ini?')) {
      try {
        await api.delete(`/api/documents/${id}`);
        toast.success('Surat berhasil dihapus.');
        mutateDocuments();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal menghapus surat.');
      }
    }
  };

  // ==========================================
  // VIEW 1: DIRECTORY MODE (CARD DIRECTORY)
  // ==========================================
  if (!activeWorkspace) {
    if (eventsLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Memuat direktori dokumen...</p>
          </div>
        </div>
      );
    }

    if (eventsError) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
            <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
            <div className="text-center">
              <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat direktori</p>
              <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil daftar event.</p>
            </div>
          </div>
        </div>
      );
    }

    const eventList = eventsData?.data?.data || (Array.isArray(eventsData?.data) ? eventsData.data : []) || [];

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg shadow-violet-500/25">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Direktori Dokumen & Surat</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih ruang kerja dokumen umum BPH Pusat atau kepanitiaan event untuk mengelola arsip surat.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card: Dokumen Umum BPH Pusat */}
          <div
            onClick={() => {
              setActiveWorkspace({ id: null, name: 'Dokumen Umum BPH Pusat', type: 'global' });
              setPage(1);
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-50 via-white to-slate-50 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/60 hover:shadow-xl hover:shadow-violet-500/10 dark:from-violet-950/40 dark:via-slate-900/70 dark:to-slate-950/80 dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-violet-500/15"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl transition-opacity duration-300 group-hover:bg-violet-500/30" />
            <div className="relative flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-600 dark:text-violet-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-600 border border-violet-500/20 dark:text-violet-400">
                    BPH Pusat
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors dark:text-white dark:group-hover:text-violet-300">
                  Dokumen Umum BPH Pusat
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                  Pencatatan dan arsip surat keluar umum BPH Pusat organisasi.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-violet-600 dark:border-white/10 dark:text-violet-400">
                <span>Buka Ruang Kerja</span>
                <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Cards: Event Workspaces */}
          {eventList.map((event) => {
            const sekretaris =
              event.committees?.find((c) => c.position === 'Sekretaris')?.user?.name ||
              'Belum Ditentukan';
            const dateDisplay = event.start_date || event.date;

            return (
              <div
                key={event.id}
                onClick={() => {
                  setActiveWorkspace(event);
                  setPage(1);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:bg-slate-50/80 hover:shadow-xl hover:shadow-primary-500/10 dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/[0.08] dark:hover:shadow-2xl"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-500/10 blur-2xl transition-opacity duration-300 group-hover:bg-primary-500/20" />
                <div className="relative flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/15 text-primary-600 dark:text-primary-400">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-600 border border-primary-500/20 dark:text-primary-400">
                        Event
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 dark:text-white dark:group-hover:text-primary-300">
                      {event.name}
                    </h3>

                    <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{formatTanggal(dateDisplay)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">Sekretaris: {sekretaris}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-slate-500 group-hover:text-primary-600 transition-colors dark:border-white/10 dark:text-slate-400 dark:group-hover:text-primary-400">
                    <span>Buka Ruang Kerja</span>
                    <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: WORKSPACE MODE (DOCUMENT TABLE)
  // ==========================================
  if (documentsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data dokumen {activeWorkspace.name}...</p>
        </div>
      </div>
    );
  }

  if (documentsError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat data dokumen</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil data surat.</p>
          </div>
        </div>
      </div>
    );
  }

  const documents = documentsData?.data?.data || (Array.isArray(documentsData?.data) ? documentsData.data : []) || [];
  const meta = documentsData?.meta || (documentsData?.data && !Array.isArray(documentsData?.data) ? documentsData.data : null);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <button
          onClick={() => {
            setActiveWorkspace(null);
            setPage(1);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-none dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Direktori
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg ${
              activeWorkspace.id === null
                ? 'bg-gradient-to-br from-violet-500 to-violet-700 shadow-violet-500/25'
                : 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary-500/25'
            }`}
          >
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{activeWorkspace.name}</h1>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  activeWorkspace.id === null
                    ? 'bg-violet-500/15 text-violet-600 border border-violet-500/20 dark:text-violet-400'
                    : 'bg-primary-500/15 text-primary-600 border border-primary-500/20 dark:text-primary-400'
                }`}
              >
                {activeWorkspace.id === null ? 'BPH Pusat' : 'Event'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta?.total ?? documents.length} surat terdaftar
            </p>
          </div>
        </div>

        {/* Action: Add Button (Only if authorized) */}
        {canEdit && (
          <button
            onClick={() => {
              setSelectedDocument(null);
              setIsReadOnlyModal(false);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30"
          >
            <Plus className="h-4 w-4" />
            Tambah Surat
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Nomor Surat
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Judul
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Pembuat
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Link Drive
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {documents.length > 0 ? (
                documents.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-semibold text-slate-700 dark:bg-slate-700/50 dark:text-slate-200">
                        {item.letter_number}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {item.creator?.name ?? '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.drive_url ? (
                        <a
                          href={item.drive_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500/15 px-2.5 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400 transition hover:bg-primary-500/25"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Buka
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {canEdit ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedDocument(item);
                              setIsReadOnlyModal(false);
                              setModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => {
                              setSelectedDocument(item);
                              setIsReadOnlyModal(true);
                              setModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Detail
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    Belum ada data dokumen untuk ruang kerja ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Halaman {meta.current_page} dari {meta.last_page}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.last_page || !documentsData?.links?.next}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <DocumentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDocument(null);
          setIsReadOnlyModal(false);
        }}
        onSuccess={() => mutateDocuments()}
        currentUserId={user?.id}
        initialData={selectedDocument}
        isReadOnly={isReadOnlyModal}
        activeEventId={activeWorkspace?.id}
      />
    </div>
  );
}
```

## File: src/pages/Finance.jsx
```javascript
import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import FinanceModal from '../components/FinanceModal';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  ArrowLeft,
  Calendar,
  User,
  Pencil,
  Trash2,
  Eye,
  Layers,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID });
  } catch {
    return dateStr;
  }
}

export default function Finance() {
  const { user } = useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState(null);
  const [isReadOnlyModal, setIsReadOnlyModal] = useState(false);

  // --- Directory Mode: Fetch Events ---
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR(!activeWorkspace ? '/api/events?page=1' : null, paginatedFetcher);

  // --- Workspace Mode: Fetch Finances ---
  const financeUrl = activeWorkspace
    ? activeWorkspace.id
      ? `/api/finances?event_id=${activeWorkspace.id}&page=${page}`
      : `/api/finances?page=${page}`
    : null;

  const {
    data: financesData,
    error: financesError,
    isLoading: financesLoading,
    mutate: mutateFinances,
  } = useSWR(financeUrl, paginatedFetcher);

  // --- RBAC: Row-Level Authorization ---
  const isGlobalAdmin = user?.roles?.[0]?.name === 'admin';
  const isCommittee = activeWorkspace?.committees?.some(
    (c) => c.user_id === user?.id && ['Ketua', 'Bendahara'].includes(c.position)
  );
  const canEdit = isGlobalAdmin || (activeWorkspace?.id !== null && isCommittee);

  // --- Delete Handler ---
  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus transaksi ini?')) {
      try {
        await api.delete(`/api/finances/${id}`);
        toast.success('Transaksi berhasil dihapus.');
        mutateFinances();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal menghapus transaksi.');
      }
    }
  };

  // ==========================================
  // VIEW 1: DIRECTORY MODE (CARD DIRECTORY)
  // ==========================================
  if (!activeWorkspace) {
    if (eventsLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Memuat direktori keuangan...</p>
          </div>
        </div>
      );
    }

    if (eventsError) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
            <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
            <div className="text-center">
              <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat direktori</p>
              <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil daftar event.</p>
            </div>
          </div>
        </div>
      );
    }

    const eventList = eventsData?.data?.data || (Array.isArray(eventsData?.data) ? eventsData.data : []) || [];

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/25">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Direktori Kas & Keuangan</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih ruang kerja kas umum atau kepanitiaan event untuk mengelola transaksi.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card: Kas Umum */}
          <div
            onClick={() => {
              setActiveWorkspace({ id: null, name: 'Kas Umum', type: 'global' });
              setPage(1);
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/10 dark:from-emerald-950/40 dark:via-slate-900/70 dark:to-slate-950/80 dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-emerald-500/15"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-500/20 blur-2xl transition-opacity duration-300 group-hover:bg-emerald-500/30" />
            <div className="relative flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
                    Kas Utama
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors dark:text-white dark:group-hover:text-emerald-300">
                  Kas Umum
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                  Pencatatan pemasukan & pengeluaran operasional umum organisasi.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-emerald-600 dark:border-white/10 dark:text-emerald-400">
                <span>Buka Ruang Kerja</span>
                <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Cards: Event Workspaces */}
          {eventList.map((event) => {
            const ketua =
              event.committees?.find((c) => c.position === 'Ketua')?.user?.name ||
              'Belum Ditentukan';
            const dateDisplay = event.start_date || event.date;

            return (
              <div
                key={event.id}
                onClick={() => {
                  setActiveWorkspace(event);
                  setPage(1);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:bg-slate-50/80 hover:shadow-xl hover:shadow-primary-500/10 dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/[0.08] dark:hover:shadow-2xl"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-500/10 blur-2xl transition-opacity duration-300 group-hover:bg-primary-500/20" />
                <div className="relative flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/15 text-primary-600 dark:text-primary-400">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-600 border border-primary-500/20 dark:text-primary-400">
                        Event
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 dark:text-white dark:group-hover:text-primary-300">
                      {event.name}
                    </h3>

                    <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{formatTanggal(dateDisplay)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">Ketua: {ketua}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-slate-500 group-hover:text-primary-600 transition-colors dark:border-white/10 dark:text-slate-400 dark:group-hover:text-primary-400">
                    <span>Buka Ruang Kerja</span>
                    <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: WORKSPACE MODE (FINANCE TABLE)
  // ==========================================
  if (financesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data transaksi {activeWorkspace.name}...</p>
        </div>
      </div>
    );
  }

  if (financesError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat data keuangan</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil data transaksi.</p>
          </div>
        </div>
      </div>
    );
  }

  const finances = financesData?.data?.data || (Array.isArray(financesData?.data) ? financesData.data : []) || [];
  const meta = financesData?.meta || (financesData?.data && !Array.isArray(financesData?.data) ? financesData.data : null);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <button
          onClick={() => {
            setActiveWorkspace(null);
            setPage(1);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-none dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Direktori
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg ${
              activeWorkspace.id === null
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-500/25'
                : 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary-500/25'
            }`}
          >
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{activeWorkspace.name}</h1>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  activeWorkspace.id === null
                    ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400'
                    : 'bg-primary-500/15 text-primary-600 border border-primary-500/20 dark:text-primary-400'
                }`}
              >
                {activeWorkspace.id === null ? 'Kas Umum' : 'Event'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta?.total ?? finances.length} transaksi terdaftar
            </p>
          </div>
        </div>

        {/* Action: Add Button (Only if authorized) */}
        {canEdit && (
          <button
            onClick={() => {
              setSelectedFinance(null);
              setIsReadOnlyModal(false);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30"
          >
            <Plus className="h-4 w-4" />
            Tambah Transaksi
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Tanggal
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Tipe
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Deskripsi
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Sumber Dana
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Nominal
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {finances.length > 0 ? (
                finances.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {formatTanggal(item.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.type === 'income' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <ArrowUpCircle className="h-3.5 w-3.5" />
                          Pemasukan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
                          <ArrowDownCircle className="h-3.5 w-3.5" />
                          Pengeluaran
                        </span>
                      )}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {item.description}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.funding_source ? (
                        <span className="rounded-lg bg-primary-500/15 px-2.5 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                          {item.funding_source}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-right text-sm font-semibold ${
                        item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {item.type === 'income' ? '+' : '-'}{' '}
                      {formatRupiah(item.amount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {canEdit ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedFinance(item);
                              setIsReadOnlyModal(false);
                              setModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => {
                              setSelectedFinance(item);
                              setIsReadOnlyModal(true);
                              setModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Detail
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    Belum ada data transaksi untuk ruang kerja ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Halaman {meta.current_page} dari {meta.last_page}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.last_page || !financesData?.links?.next}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <FinanceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedFinance(null);
          setIsReadOnlyModal(false);
        }}
        onSuccess={() => mutateFinances()}
        currentUserId={user?.id}
        initialData={selectedFinance}
        isReadOnly={isReadOnlyModal}
        activeEventId={activeWorkspace?.id}
      />
    </div>
  );
}
```

## File: src/pages/Meeting.jsx
```javascript
import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import MeetingModal from '../components/MeetingModal';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CalendarClock,
  ExternalLink,
  ArrowLeft,
  Calendar,
  User,
  Pencil,
  Trash2,
  Eye,
  Layers,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID });
  } catch {
    return dateStr;
  }
}

function formatTanggalWaktu(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'EEEE, d MMMM yyyy — HH:mm', { locale: localeID });
  } catch {
    return dateStr;
  }
}

export default function Meeting() {
  const { user } = useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isReadOnlyModal, setIsReadOnlyModal] = useState(false);

  // --- Directory Mode: Fetch Events ---
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR(!activeWorkspace ? '/api/events?page=1' : null, paginatedFetcher);

  // --- Workspace Mode: Fetch Meetings ---
  const meetingUrl = activeWorkspace
    ? activeWorkspace.id
      ? `/api/meetings?event_id=${activeWorkspace.id}&page=${page}`
      : `/api/meetings?page=${page}`
    : null;

  const {
    data: meetingsData,
    error: meetingsError,
    isLoading: meetingsLoading,
    mutate: mutateMeetings,
  } = useSWR(meetingUrl, paginatedFetcher);

  // --- RBAC: Row-Level Authorization ---
  const isGlobalAdmin = user?.roles?.[0]?.name === 'admin';
  const isCommittee = activeWorkspace?.committees?.some(
    (c) => c.user_id === user?.id && ['Ketua', 'Sekretaris'].includes(c.position)
  );
  const canEdit = isGlobalAdmin || (activeWorkspace?.id !== null && isCommittee);

  // --- Delete Handler ---
  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus rapat ini?')) {
      try {
        await api.delete(`/api/meetings/${id}`);
        toast.success('Rapat berhasil dihapus.');
        mutateMeetings();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal menghapus rapat.');
      }
    }
  };

  // ==========================================
  // VIEW 1: DIRECTORY MODE (CARD DIRECTORY)
  // ==========================================
  if (!activeWorkspace) {
    if (eventsLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Memuat direktori rapat...</p>
          </div>
        </div>
      );
    }

    if (eventsError) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
            <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
            <div className="text-center">
              <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat direktori</p>
              <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil daftar event.</p>
            </div>
          </div>
        </div>
      );
    }

    const eventList = eventsData?.data?.data || (Array.isArray(eventsData?.data) ? eventsData.data : []) || [];

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Direktori Rapat & Notulensi</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih ruang kerja rapat umum BPH Pusat atau kepanitiaan event untuk mengelola agenda dan notulensi.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card: Rapat Umum BPH Pusat */}
          <div
            onClick={() => {
              setActiveWorkspace({ id: null, name: 'Rapat Umum BPH Pusat', type: 'global' });
              setPage(1);
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-primary-500/30 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/60 hover:shadow-xl hover:shadow-primary-500/10 dark:from-primary-950/40 dark:via-slate-900/70 dark:to-slate-950/80 dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-primary-500/15"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-500/20 blur-2xl transition-opacity duration-300 group-hover:bg-primary-500/30" />
            <div className="relative flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/20 text-primary-600 dark:text-primary-400">
                    <CalendarClock className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-primary-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-600 border border-primary-500/20 dark:text-primary-400">
                    BPH Pusat
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors dark:text-white dark:group-hover:text-primary-300">
                  Rapat Umum BPH Pusat
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                  Pencatatan dan arsip notulensi rapat umum BPH Pusat organisasi.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-primary-600 dark:border-white/10 dark:text-primary-400">
                <span>Buka Ruang Kerja</span>
                <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Cards: Event Workspaces */}
          {eventList.map((event) => {
            const sekretaris =
              event.committees?.find((c) => c.position === 'Sekretaris')?.user?.name ||
              'Belum Ditentukan';
            const dateDisplay = event.start_date || event.date;

            return (
              <div
                key={event.id}
                onClick={() => {
                  setActiveWorkspace(event);
                  setPage(1);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:bg-slate-50/80 hover:shadow-xl hover:shadow-primary-500/10 dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/[0.08] dark:hover:shadow-2xl"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-500/10 blur-2xl transition-opacity duration-300 group-hover:bg-primary-500/20" />
                <div className="relative flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/15 text-primary-600 dark:text-primary-400">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-600 border border-primary-500/20 dark:text-primary-400">
                        Event
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 dark:text-white dark:group-hover:text-primary-300">
                      {event.name}
                    </h3>

                    <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{formatTanggal(dateDisplay)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">Sekretaris: {sekretaris}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-slate-500 group-hover:text-primary-600 transition-colors dark:border-white/10 dark:text-slate-400 dark:group-hover:text-primary-400">
                    <span>Buka Ruang Kerja</span>
                    <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: WORKSPACE MODE (MEETING TABLE)
  // ==========================================
  if (meetingsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data rapat {activeWorkspace.name}...</p>
        </div>
      </div>
    );
  }

  if (meetingsError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat data rapat</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil data rapat.</p>
          </div>
        </div>
      </div>
    );
  }

  const meetings = meetingsData?.data?.data || (Array.isArray(meetingsData?.data) ? meetingsData.data : []) || [];
  const meta = meetingsData?.meta || (meetingsData?.data && !Array.isArray(meetingsData?.data) ? meetingsData.data : null);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <button
          onClick={() => {
            setActiveWorkspace(null);
            setPage(1);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-none dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Direktori
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg ${
              activeWorkspace.id === null
                ? 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary-500/25'
                : 'bg-gradient-to-br from-blue-500 to-indigo-700 shadow-indigo-500/25'
            }`}
          >
            <CalendarClock className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{activeWorkspace.name}</h1>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  activeWorkspace.id === null
                    ? 'bg-primary-500/15 text-primary-600 border border-primary-500/20 dark:text-primary-400'
                    : 'bg-indigo-500/15 text-indigo-600 border border-indigo-500/20 dark:text-indigo-400'
                }`}
              >
                {activeWorkspace.id === null ? 'BPH Pusat' : 'Event'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta?.total ?? meetings.length} rapat terdaftar
            </p>
          </div>
        </div>

        {/* Action: Add Button (Only if authorized) */}
        {canEdit && (
          <button
            onClick={() => {
              setSelectedMeeting(null);
              setIsReadOnlyModal(false);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30"
          >
            <Plus className="h-4 w-4" />
            Tambah Rapat
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Judul Rapat
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Tanggal & Waktu
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Link Notulensi
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {meetings.length > 0 ? (
                meetings.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="max-w-xs truncate px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {formatTanggalWaktu(item.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.minutes_url ? (
                        <a
                          href={item.minutes_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500/15 px-2.5 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400 transition hover:bg-primary-500/25"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Lihat
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {canEdit ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedMeeting(item);
                              setIsReadOnlyModal(false);
                              setModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => {
                              setSelectedMeeting(item);
                              setIsReadOnlyModal(true);
                              setModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Detail
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    Belum ada data rapat untuk ruang kerja ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Halaman {meta.current_page} dari {meta.last_page}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.last_page || !meetingsData?.links?.next}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <MeetingModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMeeting(null);
          setIsReadOnlyModal(false);
        }}
        onSuccess={() => mutateMeetings()}
        initialData={selectedMeeting}
        isReadOnly={isReadOnlyModal}
        activeEventId={activeWorkspace?.id}
      />
    </div>
  );
}
```

## File: src/index.css
```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  --color-primary-950: #172554;

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color-scheme: light dark;
    @apply bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white transition-colors duration-300;
  }
}

@layer components {
  /* Memaksa input untuk beradaptasi dengan mode */
  input[type="date"],
  input[type="datetime-local"] {
    color-scheme: light;
  }

  .dark input[type="date"],
  .dark input[type="datetime-local"] {
    color-scheme: dark;
  }
}
```

## File: src/layouts/DashboardLayout.jsx
```javascript
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  LayoutDashboard,
  CalendarRange,
  CalendarClock,
  Wallet,
  FileText,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Manajemen Event', href: '/dashboard/events', icon: CalendarRange, adminOnly: true },
  { name: 'Rapat', href: '/dashboard/meetings', icon: CalendarClock, restrictedForMember: true },
  { name: 'Kas', href: '/dashboard/finance', icon: Wallet, restrictedForMember: true },
  { name: 'Dokumen', href: '/dashboard/documents', icon: FileText },
  { name: 'Peringatan', href: '/dashboard/warnings', icon: AlertTriangle },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.roles?.[0]?.name === 'admin';
  const isMember = user?.roles?.[0]?.name === 'member';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-primary-950 transition-colors duration-300">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white/80 dark:border-white/10 dark:bg-slate-950/80 backdrop-blur-2xl transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Protik</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600/15 text-primary-600 shadow-sm dark:bg-primary-600/20 dark:text-primary-400 dark:shadow-primary-500/10'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isMember && item.restrictedForMember && (
                      <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Read Only
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User card */}
        <div className="border-t border-slate-200 dark:border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-100 dark:bg-white/5 px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{user?.name ?? 'Pengguna'}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.roles?.[0]?.name ?? 'user'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Halo, {user?.name ?? 'Pengguna'} 👋
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Selamat datang kembali di panel manajemen.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              aria-label="Toggle Theme"
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-600 transition-colors duration-200 hover:bg-slate-200 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {theme === 'dark' ? (
                /* Sun Icon */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-amber-400"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                /* Moon Icon */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-slate-600"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-red-500/30 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

## File: src/App.jsx
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventManagement from './pages/EventManagement';
import Finance from './pages/Finance';
import Meeting from './pages/Meeting';
import Document from './pages/Document';
import Warning from './pages/Warning';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/events" element={<EventManagement />} />
                <Route path="/dashboard/finance" element={<Finance />} />
                <Route path="/dashboard/meetings" element={<Meeting />} />
                <Route path="/dashboard/documents" element={<Document />} />
                <Route path="/dashboard/warnings" element={<Warning />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.1)',
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

## File: docs/CHANGELOG.md
```markdown
## [2026-08-20]
### Added
- Menginisiasi proyek Frontend berbasis React 18, Vite, dan Tailwind CSS.
- Mengimplementasikan `axios` dengan kapabilitas *Credentials* untuk integrasi *Cookie-based Auth* Sanctum.
- Membuat `AuthContext` untuk manajemen *state* otentikasi (CSRF Handshake, Login, Check, Logout).
- Mengimplementasikan `ProtectedRoute` untuk mengamankan akses halaman Dashboard.
- Membuat halaman Login fungsional.
## [2026-08-21]
### Fixed
- Menyelesaikan *blocker* HTTP 419 CSRF Token Mismatch saat login.
- Menambahkan parameter `withXSRFToken: true` pada konfigurasi instance Axios untuk mengatasi *breaking changes* pengiriman header CSRF pada Axios v1.6.0+ untuk *request Cross-Origin*.
## [2026-08-21]
### Added
- Mendefinisikan Draf PRD Fase 3 (Layouting & Dashboard UI).
- Merancang struktur `DashboardLayout` dengan navigasi dinamis berbasis peran (Role-based Navigation).
- Menetapkan `swr` sebagai arsitektur *data fetching* tingkat lanjut untuk visualisasi matriks *Dashboard*.
## [2026-08-21]
### Added
- Mengimplementasikan `DashboardLayout` dengan fitur *Sidebar* dan *Role-based navigation UI*.
- Menambahkan *library* `swr` untuk optimasi *caching* dan *data fetching* reaktif.
- Mengimplementasikan antarmuka *Dashboard* (Grid Cards statistik keuangan dan daftar jadwal agenda terdekat).
## [2026-08-21]
### Added
- Mendefinisikan Draf PRD Fase 4 (Core Domain Integration).
- Merancang arsitektur Modul Keuangan mencakup *SWR Pagination*, *Role-Based Access Control* (RBAC) pada UI, dan *Error Handling* untuk limitasi anggaran.  
## [2026-08-21]
### Added
- Mengimplementasikan `Finance.jsx` untuk antarmuka manajemen kas dengan *SWR Pagination* dan *Tailwind Table*.
- Membuat komponen `FinanceModal.jsx` untuk penanganan formulir dan intersep limitasi anggaran (HTTP 422).
- Menerapkan *Role-Based Access Control* (RBAC) pada UI; tombol Tambah Transaksi hanya terlihat oleh *role* `admin`.
### Changed
- Memperbarui `fetcher.js` dengan penambahan `paginatedFetcher` untuk mendukung struktur meta pada Laravel API Resources.
## [2026-08-21]
### Fixed
- Memperbaiki visibilitas teks (kontras warna) pada elemen `<option>` di dalam formulir modal.
- Menyelesaikan *error* validasi `user_id is required` dengan menyisipkan identitas sesi pengguna ke dalam *payload* POST API.
## [2026-08-21]
### Added
- Mengimplementasikan antarmuka modul `Meeting` (Rapat) beserta komponen `MeetingModal` untuk manajemen agenda rutin.
- Mengimplementasikan antarmuka modul `Document` (Surat Keluar) beserta komponen `DocumentModal` yang terintegrasi dengan validasi unik *letter_number*.
- Mengaktifkan tautan navigasi dinamis pada komponen *Sidebar* (`DashboardLayout.jsx`) menggunakan React Router DOM.
## [2026-08-21]
### Added
- Menyelesaikan *Core Domain Integration* dengan mengimplementasikan modul `Warning` (Surat Peringatan) beserta `WarningModal`.
- Menerapkan isolasi tampilan UI Peringatan yang sinkron dengan filter otorisasi pada *Backend*.
### Fixed
- Menambahkan `color-scheme: dark;` pada `index.css` global untuk memaksa mesin peramban me-*render* ikon elemen *native* (seperti `date` dan `datetime-local`) dengan kontras tinggi.
## [2026-08-21]
### Added
- Penutupan Fase 4: *Core Domain Integration*.
- Menyusun Roadmap Fase 5: *Build, Gateway Prep, & VPS Provisioning* mencakup konfigurasi Nginx untuk SPA dan pembuatan skrip *monitoring* utilisasi server berbasis Bash.
## [2026-08-21]
### Added
- Penutupan siklus pengembangan antarmuka (UI) v1.0.0.
- Aplikasi dinyatakan *feature-complete* untuk ruang lingkup *local development*.
### Changed
- Membatalkan fase *Deployment & VPS Provisioning* sesuai dengan batasan lingkup proyek (*project scope*) yang ditetapkan.
## [2026-08-21]
### Added
- Mengimplementasikan desain antarmuka *Workspace Directory* (Card Grid) untuk modul Keuangan berdasarkan pemisahan Kas Umum dan Kas Event.
- Mengintegrasikan antarmuka *Full CRUD* (`Edit` dan `Delete`) pada tabel transaksi yang terhubung ke Backend.
- Mengimplementasikan visibilitas dinamis (*Read-Only Detail* vs *Edit/Delete*) berbasis *Contextual Authorization* untuk membedakan hak akses Anggota dan BPH.
## [2026-08-21]
### Added
- Menerapkan arsitektur *Workspace Directory* (Card Grid) secara penuh pada antarmuka `Meeting.jsx`.
- Mengintegrasikan antarmuka *Full CRUD* (Edit & Delete) dan mode *Read-Only Detail* yang disinkronisasi dengan *Contextual Authorization* dari *Backend*.
## [2026-08-21]
### Changed
- Mengimplementasikan inversi semantik Tailwind (`dark:` *prefix*) pada `DashboardLayout.jsx` dan `Dashboard.jsx` untuk mendukung fungsionalitas tema ganda (*Dark/Light Mode*).
## [2026-08-21]
### Changed
- Menyelesaikan *Global UI Refactoring* gelombang kedua dengan menerapkan inversi semantik warna (Tailwind `dark:`) pada seluruh antarmuka Direktori Ruang Kerja (Keuangan, Dokumen, Rapat) beserta komponen Modal Form.
## [2026-08-21]
### Added
- Mengimplementasikan `EventManagement.jsx` beserta komponen formulirnya untuk menyediakan antarmuka CRUD *Master Data Event* bagi Administrator.
- Membuat `CommitteeModal.jsx` untuk menangani proses penunjukan dan penghapusan BPH Event secara dinamis, yang secara langsung mengontrol sistem otorisasi kontekstual.
- Menambahkan rute `/dashboard/events` yang diproteksi khusus untuk *role* Admin di navigasi tata letak Dasbor.
## [2026-08-21]
### Added
- Mengimplementasikan `CommitteeModal.jsx` dengan fitur *Custom Combobox Search* dan *Hybrid Datalist Input* untuk jabatan.
- Menambahkan fitur *Multi-Sheet Excel Export* (Form, Referensi, Panduan) dan *Sequential Bulk Import* menggunakan pustaka `xlsx`.
```
