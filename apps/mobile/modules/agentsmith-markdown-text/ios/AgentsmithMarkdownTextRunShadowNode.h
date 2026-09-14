#pragma once

#include <react/renderer/components/AgentsmithMarkdownTextSpec/EventEmitters.h>
#include <react/renderer/components/AgentsmithMarkdownTextSpec/Props.h>
#include <react/renderer/components/AgentsmithMarkdownTextSpec/States.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook::react {
extern const char AgentsmithMarkdownTextRunComponentName[];

using AgentsmithMarkdownTextRunShadowNode = ConcreteViewShadowNode<
    AgentsmithMarkdownTextRunComponentName,
    AgentsmithMarkdownTextRunProps,
    AgentsmithMarkdownTextRunEventEmitter,
    AgentsmithMarkdownTextRunState>;
}
