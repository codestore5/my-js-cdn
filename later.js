export function onChange5({ value, actionType, item }) {
    // 清除之前的定时器，以确保不会多次执行
    let onChange5DebounceTimeout;
    clearTimeout(onChange5DebounceTimeout);

    // 设置一个新的定时器，只有在指定的时间后才真正执行函数
    onChange5DebounceTimeout = setTimeout(() => {
        try {
            console.log('onChange5 函数开始执行');

            // 如果已经有请求在处理，则直接返回
            if (this.isRequestPending) return;

            // 设置标志位表示请求正在进行
            this.isRequestPending = true;

            // 显示加载提示
            const loadingToast = this.utils.toast({
                title: '正在加载数据...',
                type: 'loading'
            });

            // 创建 AbortController 对象用于取消请求
            const abortController = new AbortController();
            const signal = abortController.signal;

            // 获取数据源
            const dataSourcePromise = this.dataSourceMap.getData.load({
                formUuid: 'FORM-EFD1B7F273AE4D2CA57629C16173FFA2L1HW',
                searchFieldJson: '{}', // 或者不传递 searchFieldJson
                pageSize: 100,
                signal: signal
            });

            // 使用 Promise.race 设置超时时间
            Promise.race([dataSourcePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('请求超时')), 5000)])
             .then(response => {
                    // 关闭加载提示
                    if (typeof loadingToast === 'function') loadingToast();

                    if (!response ||!response.data ||!Array.isArray(response.data)) {
                        throw new Error('无效的响应数据');
                    }

                    console.log('远程数据:', response.data);

                    // 筛选出最高版本的记录
                    const highestVersionRecords = filterHighestVersionRecords(response.data);

                    // 构建远程数据的哈希表
                    const remoteDataHash = new Map();
                    highestVersionRecords.forEach(row => {
                        const configString = buildConfigStringFromFormData(row.formData);
                        remoteDataHash.set(row.formData.textField_m0kbgpxx, {
                            configString: configString,
                            version: extractVersionNumber(row.formData.textField_m0kbgpxy)
                        });
                    });

                    console.log('远程数据散列表:', remoteDataHash);

                    // 获取本地数据
                    const localData = this.$('tableField_ly29cdlt').getValue();

                    console.log('本地数据:', localData);

                    // 检查本地数据是否与远程数据配置重复
                    const duplicateMessages = [];
                    localData.forEach(localItem => {
                        if (localItem && remoteDataHash.has(localItem.textField_ly29cdlv)) {
                            // 数据号已经存在于远程数据中
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
                        console.log('发现重复数据');
                        alert(duplicateMessages.join('\n'));
                    } else {
                        console.log('所有字段均唯一');

                        const isAllUnique = validateRuleManyFields.call(this);

                        if (!isAllUnique) {
                            console.log('其他字段存在重复');
                            alert('错误：其他字段存在重复，请检查数据。');
                        } else {
                            console.log('所有字段均唯一');
                        }
                    }
                })
             .catch(error => {
                    // 关闭加载提示
                    if (typeof loadingToast === 'function') loadingToast();

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
                })
             .finally(() => {
                    // 清理
                    abortController.abort();
                    this.isRequestPending = false; // 标志位重置
                });
        } catch (e) {
            console.error('捕获到异常:', e);

            if (typeof loadingToast === 'function') loadingToast();

            this.utils.toast({
                title: '发生错误，请重试。',
                type: 'error'
            });
        }
    }, 500); // 延迟 500 毫秒后再执行
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
    // 正则表达式匹配并移除括号及括号内的内容
    return value.replace(/\s*\([^)]*\)\s*/g, '');
}

export function validateRuleManyFields() {
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