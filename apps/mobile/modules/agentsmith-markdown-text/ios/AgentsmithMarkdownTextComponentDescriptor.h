#pragma once

#include "AgentsmithMarkdownTextShadowNode.h"

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>

namespace facebook::react {
using AgentsmithMarkdownTextComponentDescriptor = ConcreteComponentDescriptor<AgentsmithMarkdownTextShadowNode>;

void AgentsmithMarkdownTextSpec_registerComponentDescriptorsFromCodegen(
  std::shared_ptr<const ComponentDescriptorProviderRegistry> registry);
}
