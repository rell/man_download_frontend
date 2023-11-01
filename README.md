# Maritime Aerosol Network (MAN) Data Downloader
AERONET is an international federation of ground based sun and sky scanning radiometer networks which includes hundreds of instruments covering a large portion of Earths surface to provide measurements for aerosol research.

This tool serves to create customizable datasets for maritime data.

<p align="center"><img src="https://github.com/rell/MAN-Data-Download-Tool/assets/19939107/c912345d-29d6-4278-921e-384c9ef41b21" alt="image" width="50%"></p>

**_You must have database <ins>config.ini</ins> file in source directory with database credentials to run server_**

```ini
[database]
ENGINE = django.contrib.gis.db.backends.postgis
NAME = 
USER = 
PASSWORD = 
HOST = 
PORT = 5432

[django]
SECRET_KEY =
```
