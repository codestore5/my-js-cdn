function onChange({ value, actionType, item }) {
    if (value) {
      let loading;
      let controller;
  
      try {
        // 显示加载提示
        loading = this.utils.toast({
          title: '数据从数据源回调中......',
          type: 'loading'
        });
  
        // 创建 AbortController 实例，用于取消请求
        controller = new AbortController();
        const signal = controller.signal;
  
        // 发起数据请求，使用 this.dataSourceMap.getData.load 方法
        const dataSourcePromise = this.dataSourceMap.getData.load({
          formUuid: 'FORM-EFD1B7F273AE4D2CA57629C16173FFA2L1HW',
          searchFieldJson: JSON.stringify({
            textField_m0kbgpxx: value
          }),
          pageSize: 100,
          signal: signal
        });
  
        // 创建一个超时的 Promise，5 秒后会触发超时错误
        const timeoutPromise = new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            clearTimeout(timer);
            reject(new Error('请求超时'));
          }, 5000);
        });
  
        // 使用 Promise.race 来让请求和超时 Promise 竞争
        Promise.race([dataSourcePromise, timeoutPromise])
        .then(res => {
            if (typeof loading === 'function') loading();
  
            const { data = [] } = res;
  
            // 使用 Map 存储最高版本的数据
            const highestVersionData = new Map();
  
            // 遍历数据
            data.forEach(item => {
              const { formData } = item;
              const key = formData.textField_m0kbgpxx;
              const version = formData.textField_m0kbgpxy;
  
              // 比较版本号，存储最高版本的数据
              if (!highestVersionData.has(key) || version > highestVersionData.get(key).selectField_ly29cdlw) {
                highestVersionData.set(key, {
                  textField_ly29cdlv: formData.textField_m0kbgpxx,
                  selectField_ly29cdlw: formData.textField_m0kbgpxy,
                  selectField_ly29cdlx: formData.textField_m0kbgpxz,
                  selectField_ly29cdly: formData.textField_m0kbgpy0,
                  selectField_ly29cdlz: formData.textField_m0kbgpy1,
                  selectField_ly29cdm0: formData.textField_m0kbgpy2,
                  selectField_ly29cdm1: formData.textField_m0kbgpy3,
                  selectField_ly29cdm2: formData.textField_m0kbgpy4,
                  textField_ly29cdm3: formData.textField_m0kbgpy5,
                  selectField_ly29cdm4: formData.textField_m0kbgpy6,
                  selectField_ly29cdm5: formData.textField_m0kbgpy7,
                  selectField_ly29cdm6: formData.textField_m0kbgpy8,
                  selectField_ly29cdm7: formData.textField_m0kbgpya,
                  textField_ly29cdmb: formData.textField_m0kbgpyb,
                  textField_ly29cdmc: formData.textField_m0kbgpyc,
                  selectField_ly29cdmd: formData.textField_m0kbgpyd,
                  selectField_ly29cdme: formData.textField_m0kbgpye,
                  selectField_ly29cdmf: formData.textField_m0kbgpyf,
                  textField_ly29cdmg: formData.textField_m0kbgpy9,
                  selectField_ly29cdmh: formData.textField_m0kbgpyg,
                  selectField_ly29cdmi: formData.textField_m0kbgpyh,
                  selectField_ly29cdmj: formData.textField_m0kbgpyi,
                  selectField_ly29cdmk: formData.textField_m0kbgpyj,
                  selectField_ly29cdml: formData.textField_m0kbgpyk,
                  selectField_ly29cdmm: formData.textField_m0kbgpyl,
                  selectField_ly29cdmn: formData.textField_m0kbgpym,
                  selectField_ly29cdmo: formData.textField_m0kbgpyn,
                  selectField_ly29cdmp: formData.textField_m0kbgpyy,
                  selectField_ly29cdmq: formData.textField_m0kbgpyz,
                  selectField_ly29cdmr: formData.textField_m0kbgpz0,
                  selectField_ly29cdms: formData.textField_m0kbgpz1,
                  selectField_ly29cdmt: formData.textField_m0kbgpz2,
                  selectField_ly29cdmu: formData.textField_m0kbgpz3,
                });
              }
            });
  
            // 将存储在 Map 中的数据转换为数组并更新表格数据
            const tableData = Array.from(highestVersionData.values());
            this.$('tableField_ly29cdlt').setValue(tableData);
          })
        .catch(error => {
            if (typeof loading === 'function') loading();
  
            // 处理请求错误或超时
            if (error.name === 'AbortError' || error.message === '请求超时') {
              this.utils.toast({
                title: '请求被取消或超时，请重试。',
                type: 'error'
              });
            } else {
              this.utils.toast({
                title: error.message,
                type: 'error'
              });
            }
          })
        .finally(() => {
            // 取消请求
            controller.abort();
          });
      } catch (e) {
        console.error(e);
  
        if (typeof loading === 'function') loading();
  
        // 处理其他异常
        this.utils.toast({
          title: '发生错误，请重试。',
          type: 'error'
        });
      }
    } else {
      // 当 value 为空时重置表格
      this.$('tableField_ly29cdlt').reset();
    }
  }
  
  function onChange2(newGroupId) {
    let value = this.$('tableField_ly29cdlt').getValue();
    let errorValues = [];
  
    // 定义内部函数 incrementLetter，用于将字母加 1
    function incrementLetter(letter, rowValue) {
      let nextCharCode = letter.charCodeAt(0) + 1;
      if (nextCharCode > 'Z'.charCodeAt(0)) {
        errorValues.push(rowValue.textField_ly29cdlv);
        return null;
      } else {
        return String.fromCharCode(nextCharCode);
      }
    }
  
    // 遍历 value 数组，对每个元素的 selectField_ly29cdlw 进行处理
    value.forEach((val, index) => {
      let incrementedLetter = incrementLetter(val.selectField_ly29cdlw, val);
      if (incrementedLetter!== null) {
        value[index].selectField_ly29cdlw = incrementedLetter;
      }
    });
  
    // 如果存在错误数据，显示错误信息
    if (errorValues.length > 0) {
      alert(`错误：数据版本不能超过Z，请检查你的数据。以下数据号存在问题: ${errorValues.join(', ')}`);
      return;
    }
  
    // 更新 tableField_ly29cdlt 的值
    this.$('tableField_ly29cdlt').setValue(value);
  }
  
  
  function onChange3(newVersion) {
    // 获取 tableField_ly29cdlt 的值
    let value = this.$('tableField_ly29cdlt').getValue();
  
    // 弹出提示框，让用户输入升版后的版本号
    newVersion = prompt('请输入升版后的版本号，请注意规范填写（例如：V475）：');
    if (!newVersion) {
      // 如果用户未输入版本号，直接返回，不进行后续操作
      return;
    }
  
    // 遍历 value 数组，将每个元素的 selectField_ly29cdlx 字段更新为新的版本号
    value.forEach((val, index) => {
      value[index].selectField_ly29cdlx = newVersion;
    });
  
    // 将更新后的值设置回 tableField_ly29cdlt
    this.$('tableField_ly29cdlt').setValue(value);
  }
  
  
  
  function onChange6() {
    // 获取 tableField_ly29cdlt 元素
    const tableField = this.$('tableField_ly29cdlt');
  
    // 检查 tableField 是否存在，如果不存在则输出错误并返回
    if (!tableField) {
      console.error('未找到表格字段 tableField_ly29cdlt');
      return;
    }
  
    // 获取 tableField 的值
    const value = tableField.getValue();
  
    // 检查是否有值，如果没有则输出错误并返回
    if (!value) {
      console.error('未找到本地数据');
      return;
    }
  
    // 创建一个 Map 来存储发动机型号及其附加信息
    const engineModelsWithAdditionalInfo = new Map();
  
    // 遍历 value 数组
    value.forEach(item => {
      if (item && item.selectField_ly29cdly) {
        const engineModel = item.selectField_ly29cdly;
  
        // 尝试匹配发动机型号中的括号内的内容
        const match = engineModel.match(/\(([^)]+)\)/);
  
        if (match) {
          // 如果匹配成功，提取括号内的内容作为 currentNumber，提取括号前的内容作为 baseModel
          const currentNumber = match[1];
          const baseModel = engineModel.slice(0, match.index);
  
          // 如果 baseModel 不在 Map 中，弹出提示框让用户输入新扭矩值
          if (!engineModelsWithAdditionalInfo.has(baseModel)) {
            const promptText = `请输入发动机型号${engineModel}的新扭矩值：`;
            const newValue = prompt(promptText);
  
            if (newValue!== null && newValue.trim()!== '') {
              engineModelsWithAdditionalInfo.set(baseModel, newValue);
            }
          }
        } else {
          // 如果没有匹配到括号，将 engineModel 作为 baseModel
          const baseModel = engineModel;
  
          // 如果 baseModel 不在 Map 中，弹出提示框让用户输入新的附加信息
          if (!engineModelsWithAdditionalInfo.has(baseModel)) {
            const promptText = `请输入发动机型号${baseModel}的新附加信息：`;
            const newValue = prompt(promptText);
  
            if (newValue!== null && newValue.trim()!== '') {
              engineModelsWithAdditionalInfo.set(baseModel, newValue);
            }
          }
        }
      }
    });
  
    // 再次遍历 value 数组
    value.forEach(item => {
      if (item && item.selectField_ly29cdly) {
        const engineModel = item.selectField_ly29cdly;
  
        // 再次尝试匹配发动机型号中的括号内的内容
        const match = engineModel.match(/\(([^)]+)\)/);
  
        if (match) {
          const baseModel = engineModel.slice(0, match.index);
          const additionalInfo = engineModelsWithAdditionalInfo.get(baseModel);
  
          if (additionalInfo!== undefined) {
            // 如果有附加信息，更新发动机型号
            const newEngineModel = `${baseModel}(${additionalInfo})`;
            item.selectField_ly29cdly = newEngineModel;
          }
        } else {
          const baseModel = engineModel;
          const additionalInfo = engineModelsWithAdditionalInfo.get(baseModel);
  
          if (additionalInfo!== undefined) {
            // 如果有附加信息，更新发动机型号
            const newEngineModel = `${baseModel}(${additionalInfo})`;
            item.selectField_ly29cdly = newEngineModel;
          }
        }
      }
    });
  
    // 将更新后的值设置回 tableField
    tableField.setValue(value);
  }
  
  

  
  
  
  function onChange5({ value, actionType, item }) {
        let debounceTimeout;
  let isExecuting = false;
    if (isExecuting) {
      this.utils.toast({
        title: '请稍等，上一个操作尚未完成。',
        type: 'warning'
      });
      return;
    }
  
    clearTimeout(debounceTimeout);
  
    isExecuting = true;
  
    this.isRequestPending = true;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
  
    const loadingToast = this.utils.toast({
      title: '正在加载数据...',
      type: 'loading'
    });
  
    debounceTimeout = setTimeout(async () => {
      try {
        console.log('onChange5 函数开始执行');
  
        let allRemoteData = [];
  
        const fetchRemoteData = async (currentPage = 1) => {
          try {
            const dataSourcePromise = this.dataSourceMap.getData.load({
              formUuid: 'FORM-EFD1B7F273AE4D2CA57629C16173FFA2L1HW',
              searchFieldJson: '{}',
              pageSize: 100,
              currentPage: currentPage,
              signal: signal
            });
  
            const response = await Promise.race([dataSourcePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('请求超时')), 5000))]);
  
            if (typeof loadingToast === 'function') loadingToast();
  
            if (!response ||!response.data ||!Array.isArray(response.data)) {
              throw new Error('无效的响应数据');
            }
  
            allRemoteData = [...allRemoteData,...response.data];
  
            if (response.data.length < 100) {
              return;
            }
  
            await fetchRemoteData(currentPage + 1);
          } catch (error) {
            console.error('请求失败:', error);
  
            if (error.name === 'AbortError' || error.message === '请求超时') {
              this.utils.toast({
                title: '请求被取消或超时，请重试。',
                type: 'error'
              });
            } else {
              this.utils.toast({
                title: error.message,
                type: 'error'
              });
            }
          }
        };
  
        await fetchRemoteData();
  
        const highestVersionRecords = filterHighestVersionRecords(allRemoteData);
  
        const remoteDataHash = new Map();
        highestVersionRecords.forEach(row => {
          const configString = buildConfigStringFromFormData(row.formData);
          remoteDataHash.set(row.formData.textField_m0kbgpxx, {
            configString: configString,
            version: extractVersionNumber(row.formData.textField_m0kbgpxy)
          });
        });
  
  
        const localData = this.$('tableField_ly29cdlt').getValue();
  
  
        const duplicateMessages = [];
        localData.forEach(localItem => {
          if (localItem && remoteDataHash.has(localItem.textField_ly29cdlv)) {
            duplicateMessages.push(`本地数据号 ${localItem.textField_ly29cdlv} 已存在`);
            return;
          }
  
          const localConfigString = buildConfigStringFromLocalData(localItem);
  
          for (const [dataId, entry] of remoteDataHash) {
            if (entry.configString === localConfigString) {
              duplicateMessages.push(`本地数据 ${localItem.textField_ly29cdlv} 与数据表中数据 ${dataId} 配置重复`);
              break;
            }
          }
        });
  
        if (duplicateMessages.length > 0) {
          alert(duplicateMessages.join('\n'));
        } else {
          const isAllUnique = validateRuleManyFields.call(this);
  
          if (!isAllUnique) {
            alert('错误：其他字段存在重复，请检查数据。');
          } else {
          }
        }
      } catch (e) {
        console.error('捕获到异常:', e);
  
        if (typeof loadingToast === 'function') loadingToast();
  
        this.utils.toast({
          title: '发生错误，请重试。',
          type: 'error'
        });
      } finally {
        if (this.abortController) {
          this.abortController.abort();
          delete this.abortController;
        }
        this.isRequestPending = false;
        isExecuting = false;
      }
    }, 0);
  }
  
  
  function filterHighestVersionRecords(records) {
    const versionMap = new Map();
  
    records.forEach(record => {
      const version = extractVersionNumber(record.formData.textField_m0kbgpxy);
      const dataId = record.formData.textField_m0kbgpxx;
  
      if (!versionMap.has(dataId) || compareVersions(version, versionMap.get(dataId)) > 0) {
        versionMap.set(dataId, version);
        if (!versionMap.has(dataId + '_record')) {
          versionMap.set(dataId + '_record', record);
        }
      }
    });
  
    const highestVersionRecords = [];
    versionMap.forEach((_, key) => {
      if (key.endsWith('_record')) {
        highestVersionRecords.push(versionMap.get(key));
      }
    });
  
    return highestVersionRecords;
  }
  
  function extractVersionNumber(versionString) {
    const regex = /(\d+\.\d+)/;
    const match = versionString.match(regex);
    return match? match[1] : '0.0';
  }
  
  function compareVersions(versionA, versionB) {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);
  
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const numA = i < partsA.length? partsA[i] : 0;
      const numB = i < partsB.length? partsB[i] : 0;
  
      if (numA < numB) return -1;
      if (numA > numB) return 1;
    }
  
    return 0;
  }
  
  function buildConfigStringFromFormData(formData) {
    const relatedFields = [
      'textField_m0kbgpy0', 'textField_m0kbgpy1',
      'textField_m0kbgpy2', 'textField_m0kbgpy3', 'textField_m0kbgpy4', 'textField_m0kbgpy5',
      'textField_m0kbgpy6', 'textField_m0kbgpy7', 'textField_m0kbgpy8', 'textField_m0kbgpya',
      'textField_m0kbgpyb', 'textField_m0kbgpyc', 'textField_m0kbgpyd', 'textField_m0kbgpye',
      'textField_m0kbgpyf', 'textField_m0kbgpy9', 'textField_m0kbgpyg', 'textField_m0kbgpyh',
      'textField_m0kbgpyi', 'textField_m0kbgpyj', 'textField_m0kbgpyk', 'textField_m0kbgpyl',
      'textField_m0kbgpym', 'textField_m0kbgpyn', 'textField_m0kbgpyy', 'textField_m0kbgpyz',
      'textField_m0kbgpz0', 'textField_m0kbgpz1', 'textField_m0kbgpz2', 'textField_m0kbgpz3'
    ];
  
    let configString = '';
    relatedFields.forEach(field => {
      if (formData[field]) {
        configString += removeParentheses(formData[field]);
      }
    });
  
    return configString;
  }
  
  function buildConfigStringFromLocalData(localItem) {
    const relatedFields = [
      'selectField_ly29cdly', 'selectField_ly29cdlz',
      'selectField_ly29cdm0', 'selectField_ly29cdm1', 'selectField_ly29cdm2', 'textField_ly29cdm3',
      'selectField_ly29cdm4', 'selectField_ly29cdm5', 'selectField_ly29cdm6', 'selectField_ly29cdm7',
      'textField_ly29cdmb', 'textField_ly29cdmc', 'selectField_ly29cdmd', 'selectField_ly29cdme',
      'selectField_ly29cdmf', 'textField_ly29cdmg', 'selectField_ly29cdmh', 'selectField_ly29cdmi',
      'selectField_ly29cdmj', 'selectField_ly29cdmk', 'selectField_ly29cdml', 'selectField_ly29cdmm', 'selectField_ly29cdmn', 'selectField_ly29cdmo', 'selectField_ly29cdmp', 'selectField_ly29cdmq', 'selectField_ly29cdmr', 'selectField_ly29cdms', 'selectField_ly29cdmt', 'selectField_ly29cdmu'
    ];
  
    let configString = '';
    relatedFields.forEach(field => {
      if (localItem[field]) {
        configString += removeParentheses(localItem[field]);
      }
    });
  
    return configString;
  }
  
  function removeParentheses(value) {
    return value.replace(/\s*\([^)]*\)\s*/g, '');
  }
  
  function validateRuleManyFields() {
    const tableId = 'tableField_ly29cdlt';
    const relatedFields = [
      'textField_ly29cdlv',
      'selectField_ly29cdly', 'selectField_ly29cdlz',
      'selectField_ly29cdm0', 'selectField_ly29cdm1', 'selectField_ly29cdm2', 'textField_ly29cdm3',
      'selectField_ly29cdm4', 'selectField_ly29cdm5', 'selectField_ly29cdm6', 'selectField_ly29cdm7',
      'textField_ly29cdmb', 'textField_ly29cdmc', 'selectField_ly29cdmd', 'selectField_ly29cdme',
      'selectField_ly29cdmf', 'textField_ly29cdmg', 'selectField_ly29cdmh', 'selectField_ly29cdmi',
      'selectField_ly29cdmj', 'selectField_ly29cdmk', 'selectField_ly29cdml', 'selectField_ly29cdmm', 'selectField_ly29cdmn', 'selectField_ly29cdmo', 'selectField_ly29cdmp', 'selectField_ly29cdmq', 'selectField_ly29cdmr', 'selectField_ly29cdms', 'selectField_ly29cdmt', 'selectField_ly29cdmu'
    ];
  
    const tableValue = this.$(tableId).getValue().map(row => {
      let str = '';
      relatedFields.forEach(field => {
        if (row[field]) {
          str += removeParentheses(row[field]);
        }
      });
      return str;
    });
  
    const valueSet = new Set(tableValue);
    const isUnique = tableValue.length === valueSet.size;
  
    return isUnique;
  }
  
