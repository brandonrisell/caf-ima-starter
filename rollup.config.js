import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import multiInput from "rollup-plugin-multi-input";
import copy from "rollup-plugin-copy";
import clear from "rollup-plugin-clear";

export default {
  input: ["src/**/*.js"],
  output: {
    dir: "build",
    format: "esm"
  },
  plugins: [
    clear({
      targets: ["build"]
    }),
    resolve({ dedupe: ["lit-html", "haunted"] }),
    commonjs(),
    multiInput({ relative: "src/" }),
    copy({
      targets: [{ src: "src/index.html", dest: "build" }]
    })
  ]
};
