import * as React from 'react';
import { Link } from 'react-router-dom';
import { ResourceIcon } from '@console/internal/components/utils';
import { getName, getNamespace, getUID } from '@console/shared';
import { TemplateModel } from '@console/internal/models';
import { TemplateKind } from '@console/internal/module/k8s';

export const VMTemplateLink: React.FC<VMTemplateLinkProps> = ({ template }) => {
  const name = template && (template.name || getName(template));
  const namespace = template && (template.namespace || getNamespace(template));
  const uid = template && (template.uid || getUID(template));

  return (
    <>
      <ResourceIcon kind={TemplateModel.kind} />
      <Link
        to={`/k8s/ns/${namespace}/vmtemplates/${name}`}
        title={uid}
        className="co-resource-item__resource-name"
      >
        {name}
      </Link>
    </>
  );
};

type VMTemplateLinkProps = {
  template: TemplateKind & { name?: string; namespace?: string, uid?: string };
};
