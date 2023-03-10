function calculate_escape_time(z, max_iterations) {
  c = z;
  var k = 0;
  while (k < max_iterations) {
    real = z.re * z.re - z.im * z.im + c.re;
    imaginary = 2 * z.re * z.im + c.im;
    z = { re: real, im: imaginary };

    if (z.re * z.re + z.im * z.im >= 4) {
      break;
    }
    k++;
  }
  return k;
}

function complex_coordinates_to_features(complex_coordinates, canvas_size) {
  let delta_x =
    (complex_coordinates.x2 - complex_coordinates.x1) / canvas_size.width;
  let delta_y =
    (complex_coordinates.y2 - complex_coordinates.y1) / canvas_size.height;

  let x1 = complex_coordinates.x1;
  let y1 = complex_coordinates.y1;

  return {
    x1: x1,
    y1: y1,
    delta_x: delta_x,
    delta_y: delta_y,
  };
}

function coordinates_to_complex(x, y, lower_left_deltas) {
  let re = lower_left_deltas.x1 + x * lower_left_deltas.delta_x;
  let im = lower_left_deltas.y1 + y * lower_left_deltas.delta_y;

  return {
    re: re,
    im: im,
  };
}

function make_frame(canvas_size, complex_coordinates, max_iterations) {
  const rows = canvas_size.height;
  const cols = canvas_size.width;
  let frame = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => [0, 0, 0])
  );

  let lower_left_deltas = complex_coordinates_to_features(
    complex_coordinates,
    canvas_size
  );

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let z = coordinates_to_complex(x, y, lower_left_deltas);
      let current_escape_time =
        calculate_escape_time(z, max_iterations) / max_iterations;
      frame[y][x] = escape_time_to_colour(current_escape_time, max_iterations);
    }
    progress();
  }
  return frame;
}

function make_frames(
  canvas_size,
  max_iterations,
  first_complex_coordinates,
  last_complex_coordinates,
  total_frames
) {
  frames = [];

  for (let k = 0; k < total_frames; k++) {
    let current_complex_coordinates = kth_complex_coordinate(
      first_complex_coordinates,
      last_complex_coordinates,
      total_frames,
      k
    );
    let current_frame = make_frame(
      canvas_size,
      current_complex_coordinates,
      max_iterations
    );
    frames.push(current_frame);
  }
  return frames;
}

function kth_complex_coordinate(
  first_complex_coordinates,
  last_complex_coordinates,
  total_frames,
  k
) {
  let alpha = k / total_frames;
  let x1 =
    (1 - alpha) * first_complex_coordinates.x1 +
    alpha * last_complex_coordinates.x1;
  let x2 =
    (1 - alpha) * first_complex_coordinates.x2 +
    alpha * last_complex_coordinates.x2;
  let y1 =
    (1 - alpha) * first_complex_coordinates.y1 +
    alpha * last_complex_coordinates.y1;
  let y2 =
    (1 - alpha) * first_complex_coordinates.y2 +
    alpha * last_complex_coordinates.y2;
  return {
    x1: x1,
    x2: x2,
    y1: y1,
    y2: y2,
  };
}

function escape_time_to_colour(current_escape_time) {
  let R = Math.floor(255 * Math.log10(current_escape_time));
  let B = Math.floor(255 * Math.pow(current_escape_time, 0.2));
  let G = Math.floor(
    255 *
      3 *
      (current_escape_time * (1 - current_escape_time) +
        0.25 * current_escape_time)
  );

  return [R, G, B];
}

function zoom_in(complex_coordinates, z0, speed) {
  let x1 = complex_coordinates.x1 * (1 - speed) + z0.re * speed;
  let x2 = complex_coordinates.x2 * (1 - speed) + z0.re * speed;
  let y1 = complex_coordinates.y1 * (1 - speed) + z0.im * speed;
  let y2 = complex_coordinates.y2 * (1 - speed) + z0.im * speed;

  return {
    x1: x1,
    x2: x2,
    y1: y1,
    y2: y2,
  };
}

export { make_frames, zoom_in };
