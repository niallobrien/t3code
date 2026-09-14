#pragma once

#include "AgentsmithMarkdownTextRunShadowNode.h"

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>

namespace facebook::react {
using AgentsmithMarkdownTextRunComponentDescriptor = ConcreteComponentDescriptor<AgentsmithMarkdownTextRunShadowNode>;

void AgentsmithMarkdownTextRunSpec_registerComponentDescriptorsFromCodegen(
  std::shared_ptr<const ComponentDescriptorProviderRegistry> registry);
}
