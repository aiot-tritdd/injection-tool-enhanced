# js-injection

指定したドメインに対して動的にJSタグを埋め込むChromeエクステンションです。

## How to use InjectJS tool

### Add Unpacked Tool as a Browser Extension to Google Chrome

0. Download the tool's source code.
1. Enable development mode in the Extensions settings of Google Chrome.
2. Click on [Load Unpacked] and select the downloaded source code.

### Start / Stop tool

1. Press the 🔴 `[⏹ Finish]` 🔴 button to stop the tool.
2. Press the 🟢 `[▶️ Start]` 🟢 button to activate the tool.

### Add more scripts to inject

On InjectJS Extension popup

1. Enter the vendor name (in some cases, include `www.`).
2. Enter the script link you want to inject into the domain.
    - The default setting is local script:
      - https://connect.dejima.local:9000/main.js?exclude_c=tw_id
    - But you can also use the script located on STG, for example:
      - <https://connect.stg.buyee.jp/stg/b709b6b17be6d8ceceb382fc3f230d284b7f00c81247bd366a187d6a34b20e7c/main.js>
3. Click the [Add] button.
4. Click the [Save] button to apply the list.

### Remove scripts to inject

On InjectJS Extension popup

1. Click the [X] button on the top-right of the injection setting you want to remove.
2. Click [Save] button to store and apply the list.

### More options injecting

On InjectJS Extension popup

1. [Disable current PRD] means blocking the current production tag(s), choose between `bc, mc` and `gdxc`. You can replace the fixed tag with another local/STG script.
2. [Disable current SANDBOX] means blocking the current sandbox tag(s), choose between `bc, mc` and `gdxc`. You can replace the fixed tag with another local/STG script.

### Apply Settings for testing BuyeeConnect

1. Prepare for the Regular Expression support PRD domain on `stg.js`, for example:

    ```js
        STEP2_URL_REGEX: [
          new RegExp(`${BASE_BC1_FIXTURES_REG}/case(?![36]\.html)`),
          new RegExp('https?://heloyse-official\\.myshopify\\.com/(collections/[^/]+/)?products/'),
        ],
        STEP1_URL_REGEX: [
          new RegExp(`${BASE_BC1_FIXTURES_REG}/case[36].html`),
          new RegExp('https?://heloyse-official\\.myshopify\\.com'),
        ],
    ```

    You can commit above change to GitHub.
    Start the ipcountry API on local.

    ```console
    cd ~/workspace/buyee-connect/apis/ipcountry
    aws s3 cp s3://bc-update-ip2location-stg/IP-COUNTRY.BIN . --profile buyee-stg
    npm run start:buyee:local
    ```

2. Build local script `main.js`, example:

    ```console
    buyee-connect % npm run start:vendor:product:dev -- heloyse-official.myshopify.com -f=case1.html
    ```

3. Apply [`Add more scripts to inject`](#add-more-scripts-to-inject) step above
4. Try to run an confirm result
