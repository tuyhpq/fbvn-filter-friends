import Vue from "vue";

String.prototype.extract = function(regexp) {
  let arr = this.match(regexp);
  return arr[arr.length - 1];
};

String.prototype.decodeUnicode = function() {
  let text = this.replace(/\\\\/g, "\\");
  return decodeURIComponent(JSON.parse(`"${text}"`));
};

Array.prototype.remove = function(item) {
  let index = this.indexOf(item);
  if (index !== -1) {
    this.splice(index, 1);
  }
  return this;
};

Array.prototype.removeAt = function(index) {
  let item = this[index];
  this.splice(index, 1);
  return item;
};

Object.defineProperty(Vue.prototype, "$common", {
  value: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    getAverageRGB(imgEl) {
      var blockSize = 1, // only visit every 1 pixel
        defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
        canvas = document.createElement("canvas"),
        context = canvas.getContext && canvas.getContext("2d"),
        data,
        width,
        height,
        i = -4,
        length,
        rgb = { r: 0, g: 0, b: 0 },
        count = 0;

      if (!context) {
        return defaultRGB;
      }

      height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
      width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

      context.drawImage(imgEl, 0, 0);

      try {
        data = context.getImageData(0, 0, width, height);
      } catch (e) {
        /* security error, img on diff domain */ alert("x");
        return defaultRGB;
      }

      length = data.data.length;

      while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
      }

      // ~~ used to floor values
      rgb.r = ~~(rgb.r / count);
      rgb.g = ~~(rgb.g / count);
      rgb.b = ~~(rgb.b / count);

      return rgb;
    },
    useQueues() {
      const queues = [];
      setInterval(() => {
        const turn = queues.shift();
        if (turn) {
          turn.feature(...turn.args);
        }
      }, 500);

      return {
        push(feature, ...args) {
          queues.push({ feature, args });
        }
      };
    }
  }
});
