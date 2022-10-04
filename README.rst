**If you are not running Firmware 4.4.3, then DO NOT install Mariner from this fork.  It is unlikely to
work.**

mnbf9rca: merged changes from both https://github.com/Desterly/mariner (encryption) and https://github.com/BlueFinBima/mariner (main work)

Installation
------------

Requires Python 3.x. Install as follows:
- libatlas-base-dev (for libcblas.so.3) - install with `sudo apt-get install -y libatlas-base-dev`
(from https://l9o.dev/posts/controlling-an-elegoo-mars-pro-remotely/)
- modify `/boot/config.txt` to add `dtoverlay=dwc2` to the end of the file
- enable the `dwc2` module by adding `modules-load=dwc2` to `/boot/cmdline.txt` just after `rootawait`
- create a file to store uploaded files. This creates a 2GB file and creates a file system on it - it can take quite some time to create the file. We then create a mountpoint.`:
```bash
sudo dd bs=1M if=/dev/zero of=/piusb.bin count=2048
sudo mkdosfs /piusb.bin -F 32 -I
sudo mkdir -p /mnt/usb_share
```
- add the following to `/etc/fstab`:
```
/piusb.bin /mnt/usb_share vfat users,gid=mariner,umask=002 0 2
```
- its important to check that the share mounts or it'll block boot: `sudo mount -a`
- update `/etc/rc.local` to load the `g_mass_storage` module on boot by adding the line `modprobe g_mass_storage file=/piusb.bin stall=0 ro=1` before `exit 0`. This command does that, or you can do it manually:
```bash
sudo sed -i 's/exit 0/modprobe g_mass_storage file=\/piusb.bin stall=0 removable=1 ro=0;\nexit 0/' /etc/rc.local
```


Check-out releases on this project for a deb file which can be installed if you're running 4.4.3.

🛰️ mariner (mnbf9rca fork of BlueFinBima Fork)
==============================

|CI| |docs| |codecov| |Python| |MIT license|

Web interface for controlling MSLA 3D Printers based on ChiTu controllers
remotely.  This fork is to allow Mariner to work with Firmware 4.4.3 which had to be installed
in order to allow ChitBox 1.9 sliced files to be printed.  It was found that Mariner did not
work with this Firmware level because a number of the commands stopped working.

The issue with 4.4.3 was raised as https://github.com/luizribeiro/mariner/issues/453

|Screenshot|

Features
--------

- Web interface with support for both desktop and mobile.
- Upload files to be printed through the web UI over WiFi!
- Remotely check print status: progress, current layer, time left.
- Remotely control the printer: start prints, pause/resume and stop.
- Browse files available for printing.
- Inspect ``.ctb`` files: image preview, print time and slicing settings.

For more details on the feature set, refer to our `Documentation
<https://mariner.readthedocs.io/en/latest/>`_.

Supported Printers
------------------

Mariner supports a wide range of MSLA printers, including printers from the
following manufacturers:

- Anycubic
- Creality
- EPAX
- Elegoo
- Peopoly
- Phrozen
- Voxelab

Please refer to the list of `Supported Printers
<https://mariner.readthedocs.io/en/latest/supported-printers.html>`_
on our documentation for a full list of printer models that have been tested.
If you have access to other printers and want to contribute, please open an
issue.  We're happy to support more printers!

Documentation
-------------

The documentation is available from `Read the Docs
<https://mariner.readthedocs.io/en/latest/>`_. It contains a lot of information
from how to setup the hardware, install the software, troubleshoot issues, and
how to contribute to development.

`This blog
post <https://l9o.dev/posts/controlling-an-elegoo-mars-pro-remotely/>`__
explains the setup end to end with pictures of the modifications done to an
Elegoo Mars Pro.

.. |CI| image:: https://github.com/luizribeiro/mariner/workflows/CI/badge.svg
   :target: https://github.com/luizribeiro/mariner/actions/workflows/ci.yaml
.. |docs| image:: https://readthedocs.org/projects/mariner/badge/?version=latest
   :target: https://mariner.readthedocs.io/en/latest/?badge=latest
.. |codecov| image:: https://codecov.io/gh/luizribeiro/mariner/branch/master/graph/badge.svg
   :target: https://codecov.io/gh/luizribeiro/mariner
.. |Python| image:: https://img.shields.io/badge/python-3.7%20%7C%203.8%20%7C%203.9-blue
   :target: https://www.python.org/downloads/
.. |MIT license| image:: https://img.shields.io/badge/License-MIT-blue.svg
   :target: https://luizribeiro.mit-license.org/
.. |Screenshot| image:: /docs/_static/screenshot.png
