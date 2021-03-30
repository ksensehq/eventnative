// @Libs
import React, { useCallback, useMemo } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { get, snakeCase } from 'lodash';
// @Utils
import { naturalSort } from '@util/Array';
import { SourceFormConfigField } from './SourceFormConfigField';
// @Types
import { Rule, RuleObject } from 'rc-field-form/lib/interface';
import { Parameter } from '@connectors/types';
import { SourceFormConfigProps as Props } from './SourceForm.types';
import { sourceFormCleanFunctions } from '@page/SourcesPage/partials/_common/SourceForm/sourceFormCleanFunctions';

const SourceFormConfig = ({ sources, connectorSource, initialValues, sourceIdMustBeUnique }: Props) => {

  const isUniqueSourceId = useCallback((sourceId: string) => !sources?.find((source: SourceData) => source.sourceId === sourceId), [
    sources
  ]);

  const initialSourceId = useMemo(() => {
    if (initialValues.sourceId) {
      return initialValues.sourceId;
    }

    const preparedBlank = snakeCase(connectorSource.displayName);

    if (isUniqueSourceId(preparedBlank)) {
      return preparedBlank;
    }

    const sourcesIds = sources?.reduce((accumulator: string[], current: SourceData) => {
      if (current.sourceId.includes(preparedBlank)) {
        accumulator.push(current.sourceId)
      }

      return accumulator;
    }, []);

    return sourceFormCleanFunctions.getUniqueAutoIncremented(sourcesIds, preparedBlank, '_');
  }, [sources, isUniqueSourceId, initialValues, connectorSource]);

  const validateUniqueSourceId = useCallback((rule: RuleObject, value: string) => sources?.find((source: SourceData) => source.sourceId === value)
    ? Promise.reject('Source ID must be unique!')
    : Promise.resolve(), [sources])

  const sourceIdValidators = useMemo(() => {
    const rules: Rule[] = [{ required: true, message: 'Source ID is required field' }];

    if (sourceIdMustBeUnique) {
      rules.push({
        validator: validateUniqueSourceId
      });
    }

    return rules;
  }, [validateUniqueSourceId, sourceIdMustBeUnique]);

  return (
    <>
      <Row>
        <Col span={16}>
          <Form.Item
            initialValue={initialSourceId}
            className="form-field_fixed-label"
            label={<span>SourceId:</span>}
            name="sourceId"
            rules={sourceIdValidators}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Input autoComplete="off" />
          </Form.Item>
        </Col>
      </Row>

      {connectorSource.configParameters.map(({ id, displayName, required, type, documentation, constant }: Parameter) => (
        <SourceFormConfigField
          type={type.typeName}
          typeOptions={type.data}
          preselectedTypeOption={constant}
          id={id}
          key={id}
          displayName={displayName}
          initialValue={get(initialValues, `config.${id}`)}
          required={required}
          documentation={documentation}
        />
      ))}
    </>
  );
};

SourceFormConfig.displayName = 'SourceFormConfig';

export { SourceFormConfig };