package enrichment

import (
	"github.com/jitsucom/jitsu/server/appconfig"
	"github.com/jitsucom/jitsu/server/events"
	"github.com/jitsucom/jitsu/server/jsonutils"
)

var (
	DefaultJsIPRule = &IPLookupRule{}
	DefaultJsUaRule = &UserAgentParseRule{}
)

//InitDefault initializes default lookup enrichment rules
//must be called after appconfig.Init()
func InitDefault(srcIP, dstIP, srcUA, dstUA string) {
	DefaultJsIPRule = &IPLookupRule{
		source:      jsonutils.NewJSONPath(srcIP),
		destination: jsonutils.NewJSONPath(dstIP),
		geoResolver: appconfig.Instance.GeoResolver,
		enrichmentConditionFunc: func(m map[string]interface{}) bool {
			src := events.ExtractSrc(m)
			return src != "api"
		}}
	DefaultJsUaRule = &UserAgentParseRule{
		source:      jsonutils.NewJSONPath(srcUA),
		destination: jsonutils.NewJSONPath(dstUA),
		uaResolver:  appconfig.Instance.UaResolver,
		enrichmentConditionFunc: func(m map[string]interface{}) bool {
			src := events.ExtractSrc(m)
			return src != "api"
		}}
}
