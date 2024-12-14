const { Axios } = require("axios");

// This function will be called before the task is sent to the server. It will itterate through each property, and convert buffers into base64 strings
function PreProcessTask(task) {
  for (const key in task) {
    if (task[key] instanceof Buffer) {
      task[key] = task[key].toString("base64");
    }
  }
}

class CapSolver {
  /**
   * @type {import('axios').Axios}
   */
  #client;
  /**
   * @type {String}
   */
  #clientKey;

  /**
   * @type {Number}
   */
  #delay;

  /**
   * @typedef {Object} CapSolverOptions
   * @property {String} [appId] Your developer appId from dashboard's developer section
   * @property {Boolean} [verbose=false] Whether to print the current status
   * @property {String} [verboseIdentifier] The identifier of the current instance, used to distinguish between multiple instances
   * @property {'https://api.capsolver.com'|'https://api-stable.capsolver.com'} [apiUrl='https://api.capsolver.com'] The API URL to use
   * @property {Number} [delay=2500] The delay between each status check in milliseconds
   */
  /**
   * @type {CapSolverOptions}
   */
  #options;

  /**
   * @param {String} clientKey
   * @param {CapSolverOptions} options
   */
  constructor(clientKey, options) {
    this.#clientKey = clientKey;
    this.#options = options || {};
    this.#delay = this.#options.delay || 2500;
    this.#client = new Axios({
      baseURL: this.#options.apiUrl || "https://api.capsolver.com",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * @typedef {Object} ImageToTextTask
   * @property {'ImageToTextTask'} type
   * @property {String|import('buffer').Buffer} body base64 encoded content of the image (no newlines, no data:image/***;charset=utf-8;base64,)
   * @property {('common'|'module_001'|'module_002'|'module_003'|'module_004'|'module_005'|'module_006'|'module_007'|'module_008'|'module_010'|'module_012'|'module_013'|'module_014'|'module_015'|'module_016'|'module_017'|'module_018'|'module_019'|'module_020'|'module_021'|'module_022'|'module_023'|'module_024'|'module_025'|'module_026'|'module_027'|'module_028')} [module] Specifies the module
   * @property {Number} [score] 0.8 ~ 1, Identify the matching degree. If the recognition rate is not within the range, no deduction
   */
  /**
   * @typedef {Object} ReCaptchaV2Classification
   * @property {'ReCaptchaV2Classification'} type
   * @property {String|import('buffer').Buffer} image base64 image string
   * @property {String} question please refer to the list of questions at https://docs.capsolver.com/guide/recognition/ReCaptchaClassification.html
   * @property {String} [websiteURL] Page source url to improve accuracy
   * @property {String} [websiteKey] Website key to improve accuracy
   */
  /**
   * @typedef {Object} AwsWafClassification
   * @property {'AwsWafClassification'} type
   * @property {(String|import('buffer').Buffer)[]} images base64 image strings
   * @property {String} question For full names of questions, please refer to the list of questions at https://docs.capsolver.com/guide/recognition/AwsWafClassification.html
   * @property {String} [websiteURL] Page source url to improve accuracy
   */
  /**
   * @typedef {Object} VisionEngine
   * @property {('VisionEngine')} type
   * @property {('slider_1'|'rotate_1'|'space_detection'|'slider_temu_plus'|'select_temu')} module All supported models are shown in the table below
   * @property {String} [websiteURL] Page source url to improve accuracy
   * @property {String} image Base64 encoded content of the image (no newlines, no data:image/***;charset=utf-8;base64,)
   * @property {String} imageBackground Base64 encoded content of the background image (no newlines, no data:image/***;charset=utf-8;base64,)
   * @property {String} [question] Space detection requires
   */

  /**
   * @typedef {Object} GeeTestTask
   * @property {('GeeTestTask')} type
   * @property {String} websiteURL Web address of the website using geetest, generally it's fixed value. (Ex: https://geetest.com)
   * @property {String} gt The domain gt field.
   * @property {String} challenge If you need to solve Geetest V3 you must use this parameter, don't need if you need to solve GeetestV4
   * @property {String} [captchaId] If you need to solve Geetest V4 you must use this parameter, don't need if you need to solve GeetestV3
   * @property {String} [geetestApiServerSubdomain] Special api subdomain
   */
  /**
   * @typedef {Object} GeeTestTaskProxyLess
   * @property {('GeeTestTaskProxyLess')} type
   * @property {String} websiteURL Web address of the website using geetest, generally it's fixed value. (Ex: https://geetest.com)
   * @property {String} gt The domain gt field.
   * @property {String} challenge If you need to solve Geetest V3 you must use this parameter, don't need if you need to solve GeetestV4
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {String} [captchaId] If you need to solve Geetest V4 you must use this parameter, don't need if you need to solve GeetestV3
   * @property {String} [geetestApiServerSubdomain] Special api subdomain
   */
  /**
   * @typedef {(GeeTestTask|GeeTestTaskProxyLess)} GeeTest
   */
  /**
   * @typedef {Object} Cookie
   * @property {String} name
   * @property {String} value
   */
  /**
   * @typedef {Object} ReCaptchaV2Task
   * @property {('ReCaptchaV2Task')} type
   * @property {String} websiteURL Web address of the website using ReCaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {String} [pageAction] some site in /anchor endpoint have sa param, it’s action value
   * @property {Boolean} [isInvisible] if recaptcha don't have pageAction, reload request body content flag have "fi"
   * @property {Cookie[]} [cookies] Learn using cookies: https://docs.capsolver.com/en/guide/api-how-to-use-cookies/
   */
  /**
   * @typedef {Object} ReCaptchaV2TaskProxyLess
   * @property {('ReCaptchaV2TaskProxyLess')} type
   * @property {String} websiteURL Web address of the website using ReCaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} [pageAction] some site in /anchor endpoint have sa param, it’s action value
   * @property {Boolean} [isInvisible] if recaptcha don't have pageAction, reload request body content flag have "fi"
   * @property {Cookie[]} [cookies] Learn using cookies: https://docs.capsolver.com/en/guide/api-how-to-use-cookies/
   */
  /**
   * @typedef {Object} ReCaptchaV2EnterpriseTask
   * @property {('ReCaptchaV2EnterpriseTask')} type
   * @property {String} websiteURL Web address of the website using ReCaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {String} [pageAction] some site in /anchor endpoint have sa param, it’s action value
   * @property {Object} [enterprisePayload] Enterprise Payload
   * @property {Boolean} [isInvisible] if recaptcha don't have pageAction, reload request body content flag have "fi"
   * @property {String} [apiDomain] Domain address from which to load reCAPTCHA Enterprise. For example: http://www.google.com/ or http://www.recaptcha.net/. Don't use a parameter if you don't know why it's needed.
   * @property {Cookie[]} [cookies] Learn using cookies: https://docs.capsolver.com/en/guide/api-how-to-use-cookies/
   */
  /**
   * @typedef {Object} ReCaptchaV2EnterpriseTaskProxyLess
   * @property {('ReCaptchaV2EnterpriseTaskProxyLess')} type
   * @property {String} websiteURL Web address of the website using ReCaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} [pageAction] some site in /anchor endpoint have sa param, it’s action value
   * @property {Object} [enterprisePayload] Enterprise Payload
   * @property {Boolean} [isInvisible] if recaptcha don't have pageAction, reload request body content flag have "fi"
   * @property {String} [apiDomain] Domain address from which to load reCAPTCHA Enterprise. For example: http://www.google.com/ or http://www.recaptcha.net/. Don't use a parameter if you don't know why it's needed.
   * @property {Cookie[]} [cookies] Learn using cookies: https://docs.capsolver.com/en/guide/api-how-to-use-cookies/
   */
  /**
   * @typedef {(ReCaptchaV2Task|ReCaptchaV2TaskProxyLess|ReCaptchaV2EnterpriseTask|ReCaptchaV2EnterpriseTaskProxyLess)} ReCaptchaV2
   */
  /**
   * @typedef {Object} ReCaptchaV3Task
   * @property {'ReCaptchaV3Task'} type
   * @property {String} websiteURL Web address of the website using ReCaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} pageAction Widget action value. Website owner defines what user is doing on the page through this parameter. Example: grecaptcha.execute('site_key', {action:'login}).
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {Cookie[]} [cookies] Learn using cookies: https://docs.capsolver.com/en/guide/api-how-to-use-cookies/
   */
  /**
   * @typedef {Object} ReCaptchaV3TaskProxyLess
   * @property {'ReCaptchaV3TaskProxyLess'} type
   * @property {String} websiteURL Web address of the website using ReCaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} pageAction Widget action value. Website owner defines what user is doing on the page through this parameter. Example: grecaptcha.execute('site_key', {action:'login}).
   * @property {Cookie[]} [cookies] Learn using cookies: https://docs.capsolver.com/en/guide/api-how-to-use-cookies/
   */
  /**
   * @typedef {Object} ReCaptchaV3EnterpriseTask
   * @property {'ReCaptchaV3EnterpriseTask'} type
   * @property {String} websiteURL Web address of the website using ReCaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} pageAction Widget action value. Website owner defines what user is doing on the page through this parameter. Example: grecaptcha.execute('site_key', {action:'login}).
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {Object} enterprisePayload Enterprise payload
   * @property {String} apiDomain Domain address from which to load reCAPTCHA Enterprise. For example: http://www.google.com/ or http://www.recaptcha.net/. Don't use a parameter if you don't know why it's needed.
   * @property {Cookie[]} [cookies] Learn using cookies: https://docs.capsolver.com/en/guide/api-how-to-use-cookies/
   */
  /**
   * @typedef {Object} ReCaptchaV3EnterpriseTaskProxyLess
   * @property {'ReCaptchaV3EnterpriseTaskProxyLess'} type
   * @property {String} websiteURL Web address of the website using ReCaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} pageAction Widget action value. Website owner defines what user is doing on the page through this parameter. Example: grecaptcha.execute('site_key', {action:'login}).
   * @property {Object} enterprisePayload Enterprise payload
   * @property {String} apiDomain Domain address from which to load reCAPTCHA Enterprise. For example: http://www.google.com/ or http://www.recaptcha.net/. Don't use a parameter if you don't know why it's needed.
   * @property {Cookie[]} [cookies] Learn using cookies: https://docs.capsolver.com/en/guide/api-how-to-use-cookies/
   */
  /**
   * @typedef {(ReCaptchaV3Task|ReCaptchaV3TaskProxyLess|ReCaptchaV3EnterpriseTask|ReCaptchaV3EnterpriseTaskProxyLess)} ReCaptchaV3
   */
  /**
   * @typedef {(ReCaptchaV2|ReCaptchaV3)} ReCaptcha
   */
  /**
   * @typedef {Object} MTCaptcha
   * @property {'MTCaptcha'} type
   * @property {String} websiteURL Web address of the website using MTCaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: sk=MTPublic-xxx public key)
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   */
  /**
   * @typedef {Object} DatadomeSlider
   * @property {'DatadomeSliderTask'} type
   * @property {String} websiteURL The address of the target page.
   * @property {String} captchaUrl if the url contains t=bv that means that your ip must be banned, t should be t=fe
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {String} userAgent You need to keep your userAgent consistent with the one used to request the captchaUrl. Currently, we only support two fixed userAgents.
   */

  /**
   * @typedef {Object} AntiCloudflare
   * @property {'AntiTurnstileTaskProxyLess'} type
   * @property {String} websiteURL The address of the target page.
   * @property {String} websiteKey Turnstile website key.
   * @property {Object} [metadata] Turnstile extra data. Turnstile Documentation: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
   * @property {String} [metadata.action] The value of the data-action attribute of the Turnstile element if it exists.
   * @property {String} [metadata.cdata] The value of the data-cdata attribute of the Turnstile element if it exists.
   */

  /**
   * @typedef {Object} AwsWafCaptcha
   * @property {'AntiAwsWafTask'|'AntiAwsWafTaskProxyLess'} type
   * @property {String} websiteURL The URL of the page that returns the captcha info.
   * @property {String} [awsKey] When the status code returned by the websiteURL page is 405, awsKey is required
   * @property {String} [awsIv] When the status code returned by the websiteURL page is 405, awsIv is required
   * @property {String} [awsContext] When the status code returned by the websiteURL page is 405, awsContext is required
   * @property {String} [awsChallengeJS] When the status code returned by the websiteURL page is 405 or 202, awsChallengeJs is required
   * @property {String} [proxy] Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   */

  /**
   * @typedef {Object} FriendlyCaptcha
   * @property {'FriendlyCaptchaTaskProxyless'} type
   * @property {String} websiteURL The page address, where the Friendly Captcha is solved
   * @property {String} websiteKey FriendlyCaptcha website key.
   */

  /**
   * @typedef {Object} YandexCaptcha
   * @property {'YandexCaptchaTaskProxyLess'} type
   * @property {String} websiteURL The page address, where the Yandex Captcha is solved
   * @property {String} websiteKey YandexCaptcha website key.
   */

  async delay(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async verbose(log) {
    if (this.#options?.verbose || false) {
      const verboseIdentifier = this.#options?.verboseIdentifier
        ? `${this.#options?.verboseIdentifier} `
        : "";
      console.log(`${verboseIdentifier}${log}`);
    }
  }
  /**
   * @typedef {(ImageToTextTask|ReCaptchaV2Classification|AwsWafClassification|VisionEngine)} RecognitionTask
   */
  /**
   * @typedef {(GeeTest|ReCaptcha|MTCaptcha|DatadomeSlider|AntiCloudflare|AwsWafCaptcha|FriendlyCaptcha|YandexCaptcha)} TokenTask
   */
  /**
   * @typedef {(RecognitionTask|TokenTask)} CapSolverTask
   */

  /**
   * @typedef {Object} CapSolverBalanceResponse
   * @property {(0|1)} errorId Error message: 0 - no error, 1 - with error
   * @property {String} errorCode https://docs.capsolver.com/guide/api-error.html
   * @property {String} errorDescription Short description of the error
   * @property {Number} balance Balance in USD
   * @property {any[]} packages List of Monthly/Weekly Packages
   */
  /**
   * @returns {CapSolverBalanceResponse}
   */
  async getBalance() {
    const response = await this.#client.request({
      method: "POST",
      url: "/getBalance",
      data: JSON.stringify({
        clientKey: this.#clientKey,
      }),
    });
    return JSON.parse(response.data);
  }

  /**
   * @typedef CapSolverCreateTaskResponse
   * @property {(0|1)} errorId Error message: 0 - no error, 1 - with error
   * @property {String} errorCode https://docs.capsolver.com/guide/api-error.html
   * @property {String} errorDescription Error description
   * @property {"ready"|null} status returns the status, which can only be null or ready
   * @property {Object} solution
   * @property {String} taskId ID of the created task
   */
  /**
   * @param {CapSolverTask} task
   * @returns {CapSolverCreateTaskResponse}
   */
  async createTask(task) {
    PreProcessTask(task);
    const response = await this.#client.request({
      method: "POST",
      url: "/createTask",
      data: JSON.stringify({
        clientKey: this.#clientKey,
        appId: this.#options.appId || "6B27D516-3A6F-4E13-9DED-F517295F5F89",
        task,
      }),
    });
    return JSON.parse(response.data);
  }

  /**
   * @typedef CapSolverGetTaskResultResponse
   * @property {(0|1)} errorId Error message: 0 - no error, 1 - with error
   * @property {String} errorCode https://docs.capsolver.com/guide/api-error.html
   * @property {String} errorDescription Error description
   * @property {"ready"|null} status returns the status, which can only be null or ready
   * @property {Object} solution
   */
  /**
   * @param {String} taskId
   * @returns {Promise<CapSolverGetTaskResultResponse>}
   */
  async getTaskResult(taskId) {
    const response = await this.#client.request({
      method: "POST",
      url: "/getTaskResult",
      data: JSON.stringify({
        clientKey: this.#clientKey,
        taskId,
      }),
    });
    return JSON.parse(response.data);
  }

  /**
   * @typedef FeedbackTaskResult
   * @property {Boolean} invalid Whether the results of task processing pass validation
   * @property {Number} code Error code [optional]
   * @property {String} message Error message [optional]
   */

  /**
   * @typedef CapSolverFeedbackTaskResponse
   * @property {(0|1)} errorId Error message: 0 - no error, 1 - with error
   * @property {String} errorCode https://docs.capsolver.com/guide/api-error.html
   * @property {String} errorDescription Error description
   * @property {String} message Returns the messages
   */

  /**
   * @param {String} taskId 
   * @param {FeedbackTaskResult} result 
   * @returns {Promise<CapSolverFeedbackTaskResponse>}
   */
  async feedbackTask(taskId, result) {
    const response = await this.#client.request({
      method: "POST",
      url: "/feedbackTask",
      data: JSON.stringify({
        clientKey: this.#clientKey,
        appId: this.#options.appId || "6B27D516-3A6F-4E13-9DED-F517295F5F89",
        taskId,
        result,
      }),
    });
    return JSON.parse(response.data);
  }

  /**
   * @typedef CapSolverSolveTaskResult
   * @property {(0|1)} errorId Error message: 0 - no error, 1 - with error
   * @property {String} errorCode https://docs.capsolver.com/guide/api-error.html
   * @property {String} errorDescription Error description
   * @property {"ready"|null} status returns the status, which can only be null or ready
   * @property {Object} solution
   * @property {String} taskId ID of the created task
   */

  /**
   * @param {CapSolverTask} task
   * @returns {Promise<CapSolverSolveTaskResult>}
   */
  async solve(task) {
    if (!task)
      return {
        errorCode: "ERROR_INVALID_TASK_DATA",
        errorDescription: "Missing task data.",
        errorId: 1,
      };

    const response = await this.createTask(task);
    if (response.status === "ready" || response.errorId === 1) return response;
    const taskId = response.taskId;

    this.verbose(`[${taskId}] Created [${task.type}].`);

    while (true) {
      const result = await this.getTaskResult(taskId);
      if (result.status === "ready" || result.errorId === 1) {
        const verboseMessage =
          result?.status === "ready" ? `Solved!` : `Failed!`;
        this.verbose(`[${taskId}] ${verboseMessage}`);

        return result;
      }

      this.verbose(`[${taskId}] Waiting ${this.#delay}ms...`);
      await this.delay(this.#delay);
    }
  }
}

module.exports = CapSolver;
