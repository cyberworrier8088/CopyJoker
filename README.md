# CopyJoker

A simple and modern QR code generator and scanner.

CopyJoker lets you generate QR code from text or URLs and scan QR codes from images or your device camera

## Description
CopyJoker is a QR code utility built  with Rust, Tauri, HTML, CSS, and JavaScript. The project provides a clean interface for creating QR codes and scanning existing QR codes.

You can generate QR codes from text or URLs, download generated QR codes as SVG files, scan QR codes from PNG, JPG, JPEG, and SVG images, and use your device camera to scan QR codes.

## Features

- Generate QR codes from text or URLs
- Download generated QR codes as SVG
- Scan QR codes from images
- Support for PNG, JPG, JPEG, and SVG files
- Responsive interface for different screen sizes
- Simple and modern UI

## Screenshot

![img](img/f.png)
![img](img/g.png)

## Getting Started

### Release downloads

Each GitHub release includes installers for Windows (`CopyJoker_x64-setup.exe` and `CopyJoker_x64.msi`), Linux (`CopyJoker.AppImage` and `CopyJoker.deb`), macOS (`CopyJoker.dmg`), and Android (`CopyJoker.apk`, arm64).

### Dependencies

Before running CopyJoker, make sure you have the followeing installed:

- Rust
- Cargo
- Tauri CLI
- A supported operating system such as Windows, Linux, or macOS

You can check your Rust installation with:

```bash
rustc --version
cargo --version
```

You can check the Tauri CLI with:

```bash
cargo tauri --version
```

### Installing

1. Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/CopyJoker.git
```

2. Move into the project directory:

```bash
cd CopyJoker
```

3. Install the required Rust dependencies:

```bash
cargo build
```

No additional modifications should be required before running the project.

## Executing program

### Run in development mode

1. Open a terminal inside the project folder.
2. Run:

```bash
cargo tauri dev
```

3. Wait for the application to compile.
4. CopyJoker will open automatically.

### Using CopyJoker

#### Generate a QR Code

1. Enter text or a URL.
2. Click **Generate QR**.
3. Your QR code will appear in the preview area.
4. Click **Download SVG** to save the generated QR code.

#### Scan an Image

1. Click **Choose an image**.
2. Select a PNG, JPG, JPEG, or SVG file containing a QR code.
3. The scanned result will appear in the **Scan Result** section.

#### Scan Using Camera

1. Click **Start Camera**.
2. Allow camera access when requested.
3. Point the camera at a QR code.
4. The result will appear automatically.
5. Click **Stop Camera** when finished.

## Help

If the project does not run correctly, try updating your Rust toolchain:

```bash
rustup update
```

Then clean and rebuild the project:

```bash
cargo clean
cargo tauri dev
```

For Tauri-related issues, make sure the required system dependencies are installed for your operating system.

## Contributing

Contributions, issues, and feature requests are welcome.

If you find a bug or have an idea for improving CopyJoker, feel free to open an issue or submit a pull request.

## Future Improvements

Possible future improvements include:

- More QR code customization options
- Different QR colors and styles
- PNG download support
- QR scan history
- Copy scanned results with one click
- Improved mobile web support

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
